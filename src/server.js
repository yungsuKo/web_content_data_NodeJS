import "dotenv/config";
import express from "express";
import { application } from "express";
import rootRouter from "./routers/rootRouter";
import dataRouter from "./routers/dataRouter";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import expressSession from "express-session";
import MongoStore from "connect-mongo";
import "./db";
const crawler_kakao1Boon = require("./crawlers/1boon_crawler.js");
const crawler_naverPost = require("./crawlers/post_crawler.js");
const schedule = require("node-schedule");
const { now } = require("mongoose");


const app = express();
const port = process.env.PORT || 80;
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
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_KEY,
    }),
  })
);

app.use(logger);
console.log(process.env.MONGODB_KEY);

const handleListening = () =>
  console.log(`✅ server listening from http://localhost:${port} 🚀`);
app.listen(port, handleListening);
app.set("view engine", "ejs");
console.log(__dirname);
app.set("views", process.cwd() + "/src/views");

app.use("/", rootRouter);
app.use("/data", dataRouter);
app.use("/assets", express.static("assets"));

var job = schedule.scheduleJob("0 5 0 * * *", async function () {
  let mNow = new Date();
  console.log(mNow);

  await crawler_kakao1Boon();
  await crawler_naverPost();
});
