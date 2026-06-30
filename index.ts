import express from "express";
import "dotenv/config";
import router from "./routes/user.routes.ts";
import urlRoute from "./routes/url.routes.ts";
import healthRouter from "./routes/health.routes.ts";
import { pinoHttp } from "pino-http";
import { authorization } from "./middleware/authorization.middleware.ts";
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(pinoHttp());
app.use(authorization);
app.use("/user", router);
app.use("/url", urlRoute);
app.use("/health", healthRouter);

app.listen(PORT, () => {
  console.log(`port is up and listening`);
});
