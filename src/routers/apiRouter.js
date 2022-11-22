import express from "express";
import {
    dayDataController
} from "../controllers/api/dayDataController";
import { apiDetailController } from "../controllers/api/dayDataController";
import { protectorMiddleware } from "../middlewares";
const apiRouter = express.Router();

apiRouter.route("/date").all(protectorMiddleware).get(dayDataController);

export default apiRouter;
