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
import AccountUrl from "./models/AccountUrl";
import CrawlUrlPost from "./models/CrawlUrlPost";
import PostDetail from "./models/PostDetail";
import schedulePostCrawler from "./crawlers/scheduleCrawler";
import scheduleDetailCrawler from "./crawlers/scheduleCrawler";
import "./db";
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

var job = schedule.scheduleJob("10 0 0 * * *", async function () {
  let mNow = new Date();
  mNow.setDate(mNow.getDate()-1);
  console.log(mNow.toString());
  const accountUrls = await AccountUrl.find({});
  for (let i=0; i<accountUrls.length; i++){
    // 계정 url을 하나씩 순회하여 게시물 정보를 업데이트함
    // 포스트 db에서 계정 url을 기준으로 뽑음
    await schedulePostCrawler(accountUrls[i]);
    const postUrls = await CrawlUrlPost.find({
      uploadTime:{$gt : mNow}
    });
    console.log(postUrls);
    for (let j=0; j<postUrls.length; j++){
      await scheduleDetailCrawler(postUrls[j], accountUrls[i]);
    }
  }

});

