import express from "express";
const app = express();

import { setupRoutes } from "./src/routes/v1/index.js";
import { registerMiddlewares } from "./src/middlewares/global.middleware.js";
import { errorHandler, notFound } from "./src/middlewares/index.js";

registerMiddlewares(app);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

setupRoutes(app);

app.use(notFound);
app.use(errorHandler);

export default app;
