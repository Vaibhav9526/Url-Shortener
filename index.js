import express from "express";
import "dotenv/config";
import router from "./routes/user.routes.js";
import urlRoute from "./routes/url.routes.js";
import { authorization } from "./middleware/authorization.middleware.js";
const app = express();
const PORT = process.env.PORT ?? 8000;

app.use(express.json());
app.use(authorization);
app.use("/user", router);
app.use("/url", urlRoute);

app.listen(PORT, () => {
  console.log(`port is up and listening`);
});
