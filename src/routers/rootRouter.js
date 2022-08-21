import express from "express";
import { getLogin, postLogin } from "../controllers/userController";

const rootRouter = express.Router();

rootRouter.route("/login").get(getLogin).post(postLogin);

export default rootRouter;
