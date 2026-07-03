import express from "express";
const healthRouter = express.Router();

healthRouter.get("/", (req, res) => {
  res.status(200).json({ status: "OK" });
});

export default healthRouter;
