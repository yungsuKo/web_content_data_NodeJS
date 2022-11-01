import express from "express";
import { getLogin, postLogin, getSignup, postSignup, logout } from "../controllers/userController";
import { publicMiddleware, protectorMiddleware } from "../middlewares";

const rootRouter = express.Router();

rootRouter.route("/").all(publicMiddleware).get(getLogin).post(postLogin);
rootRouter.route("/signup").all(publicMiddleware).get(getSignup).post(postSignup);
rootRouter.route("/logout").get(logout);
export default rootRouter;