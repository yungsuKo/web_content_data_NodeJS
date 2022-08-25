import express from "express";
import {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
} from "../controllers/userController";
import { publicMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.route("/").all(publicMiddleware).get(getLogin).post(postLogin);
rootRouter
  .route("/signup")
  .all(publicMiddleware)
  .get(getSignup)
  .post(postSignup);

export default rootRouter;
