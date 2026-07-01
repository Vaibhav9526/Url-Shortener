import swaggerAutogen from "swagger-autogen";

const doc = {
  info: {
    title: "URL SHORTENER API",
    description: "descrete api of my app , lot to improve , more to add",
  },
  host: `http://localhost:${process.env.PORT}`,
};

const outputFile = "../swagger-output.json";
const routes = ["./routes/url.routes.ts", "./routes/user.routes.ts", "./routes/health.routes.ts"];

swaggerAutogen()(outputFile, routes, doc);
