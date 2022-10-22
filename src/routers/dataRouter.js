import express from "express";
import {
  getDataListController,
  postDataListController,
  dataDetailController
} from "../controllers/dataController";
import { protectorMiddleware } from "../middlewares";
const dataRouter = express.Router();

dataRouter.route("/").all(protectorMiddleware).get(getDataListController).post(postDataListController);
dataRouter.route("/detail/:id").all(protectorMiddleware).get(dataDetailController);

export default dataRouter;
