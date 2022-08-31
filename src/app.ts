import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middleware/errorHandler";
import express from "express";

export const app = express();

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

RegisterRoutes(app);

app.use(errorHandler);