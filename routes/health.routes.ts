import express from "express";
import { appLogger } from "../middleware/logger.middleware.ts";
const healthRouter = express.Router();

healthRouter.get(
  "/",
  appLogger((req, res) => {
    res.status(200).json({ status: "OK" });
  }),
);

export default healthRouter;
