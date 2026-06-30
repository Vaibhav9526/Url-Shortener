import type { Response, Request } from "express";
import pino from "pino";

type LoggerCallback = (req: Request, res: Response) => void;

const fileLogger = pino({
  transport: {
    target: "pino/file",
    options: { destination: "./logs/app.log", mkdir: true },
  },
});

export const appLogger = (handler: LoggerCallback) => {
  return (req: Request, res: Response): void => {
    req.log.info({ method: req.method, url: req.url });

    res.on("finish", () => {
      fileLogger.info({
        statusCode: res.statusCode,
        method: req.method,
        url: req.url,
      });
    });

    handler(req, res);
  };
};
