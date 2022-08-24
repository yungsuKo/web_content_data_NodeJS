import express from "express";
import { summaryController } from "../controllers/dataController";
import { protectorMiddleware } from "../middlewares";
const dataRouter = express.Router();

dataRouter.route("/summary").all(protectorMiddleware).get(summaryController);

export default dataRouter;
