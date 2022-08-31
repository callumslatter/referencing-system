import bodyParser from "body-parser";
import { RegisterRoutes } from "../build/routes";
import { errorHandler } from "./middleware/errorHandler";
import express from "express";

export const app = express();

app.use(bodyParser.json());

RegisterRoutes(app);

app.use(errorHandler);