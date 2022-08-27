import express from "express";
import {
  summaryController,
  naverController,
  kakaoController,
} from "../controllers/dataController";
import { protectorMiddleware } from "../middlewares";
const dataRouter = express.Router();

dataRouter.route("/summary").all(protectorMiddleware).get(summaryController);
dataRouter.route("/naver").all(protectorMiddleware).get(naverController);
dataRouter.route("/kakao").all(protectorMiddleware).get(kakaoController);

export default dataRouter;
