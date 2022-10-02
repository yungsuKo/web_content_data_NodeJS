import express from "express";
import dotenv from "dotenv";
import { application } from "express";
import rootRouter from "./routers/rootRouter";
import dataRouter from "./routers/dataRouter";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";
import "./db";

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;
const logger = morgan(":url");
app.use(express.static(__dirname + "/public"));

// 미들웨어 등록
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

// cookie, session assign middleware
app.use(cookieParser());

// 세션 세팅
app.use(
  expressSession({
    secret: "asdvxcvorem24rtwe0fo2k3013",
    resave: true,
    saveUninitialized: true,
  })
);

app.use(logger);

const handleListening = () =>
  console.log(`✅ server listening from http://localhost:${port} 🚀`);
app.listen(port, handleListening);
app.set("view engine", "ejs");
console.log(__dirname);
app.set("views", process.cwd() + "/src/views");

app.use("/", rootRouter);
app.use("/data", dataRouter);
app.use("/assets", express.static("assets"));
