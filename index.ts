import express from "express";
import "dotenv/config";

import { pinoHttp } from "pino-http";
import { authorization } from "./middleware/authorization.middleware.ts";

import router from "./routes/user.routes.ts";
import urlRoute from "./routes/url.routes.ts";
import healthRouter from "./routes/health.routes.ts";

import swaggerUi from "swagger-ui-express";
import swaggerDocument from "./swagger-output.json" with { type: "json" };

const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(pinoHttp());
app.use(authorization);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/user", router);
app.use("/url", urlRoute);
app.use("/health", healthRouter);

app.listen(PORT, () => {
  console.log(`port is up and listening`);
});
