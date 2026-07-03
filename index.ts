import express from "express";
import "dotenv/config";

import { authorization } from "./middleware/authorization.middleware.ts";
import { logger, requestLogger } from "./middleware/logger.middleware.ts";

import router from "./routes/user.routes.ts";
import urlRoute from "./routes/url.routes.ts";
import healthRouter from "./routes/health.routes.ts";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };
import helmet from "helmet";
import cookieParser from "cookie-parser";

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(helmet());
app.use(cookieParser());
app.use(requestLogger);

app.use(authorization);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/user", router);
app.use("/url", urlRoute);
app.use("/health", healthRouter);

app.listen(PORT, () => {
  logger.info({ port: PORT }, "server started");
});
