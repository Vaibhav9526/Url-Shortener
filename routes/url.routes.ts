import express from "express";
import { postUrl, redirect, myUrl } from "../controllers/url.controller.ts";

const urlRoute = express.Router();

urlRoute.get("/my", myUrl);
urlRoute.post("/shorten", postUrl);
urlRoute.get("/:code", redirect);

export default urlRoute;
