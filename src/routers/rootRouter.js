import express from "express";
import {
  getLogin,
  postLogin,
  getSignup,
  postSignup,
} from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.route("/signup").get(getSignup).post(postSignup);

export default rootRouter;
