import type { NextFunction, Request, Response } from "express";
import { randomUUID } from "node:crypto";
import pino from "pino";
import pinoHttp from "pino-http";
import type IAuthUser from "../types/Auth.types.ts";

type LogLevel = "fatal" | "error" | "warn" | "info" | "debug" | "trace";

type LoggerContext = Record<string, unknown>;

type RouteLoggerHandler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

type AppLoggerOptions = {
  level?: LogLevel;
  message?: string;
  context?: LoggerContext;
};

const logLevel = (process.env.LOG_LEVEL as LogLevel | undefined) ?? "info";

export const logger = pino({
  level: logLevel,
  base: {
    service: "url-shortener-backend",
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export const requestLogger = pinoHttp({
  logger,
  genReqId: (req) => req.headers["x-request-id"]?.toString() ?? randomUUID(),
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res, error) =>
    `${req.method} ${req.url} ${res.statusCode} ${error.message}`,
  customLogLevel: (_req, res, error) => {
    if (error || res.statusCode >= 500) return "error";
    if (res.statusCode >= 400) return "warn";
    return "info";
  },
  customProps: (req, res) => {
    const expressReq = req as Request & { id?: string; user?: IAuthUser };

    return {
      requestId: expressReq.id,
      userId: expressReq.user?.id,
      statusCode: res.statusCode,
    };
  },
});

export const appLogger = (handler: RouteLoggerHandler, options: AppLoggerOptions = {}) => {
  const level = options.level ?? "info";
  const message = options.message ?? "request completed";

  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const startedAt = Date.now();

    try {
      await handler(req, res, next);

      const expressReq = req as Request & { id?: string; user?: IAuthUser };

      logger[level](
        {
          ...options.context,
          method: req.method,
          url: req.originalUrl,
          statusCode: res.statusCode,
          durationMs: Date.now() - startedAt,
          requestId: expressReq.id,
          userId: expressReq.user?.id,
        },
        message
      );
    } catch (error) {
      const expressReq = req as Request & { id?: string; user?: IAuthUser };

      logger.error(
        {
          ...options.context,
          method: req.method,
          url: req.originalUrl,
          durationMs: Date.now() - startedAt,
          requestId: expressReq.id,
          userId: expressReq.user?.id,
          err: error,
        },
        "route handler failed"
      );

      next(error as Error);
    }
  };
};
