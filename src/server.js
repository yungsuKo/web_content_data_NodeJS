import express from "express";
import { application } from "express";
import rootRouter from "./routers/rootRouter";
import morgan from "morgan";

const app = express();
const port = 4000;
const logger = morgan(":url");

app.use(logger);
const handleListening = () =>
  console.log(`✅ server listening from http://localhost:${port} 🚀`);
app.listen(port, handleListening);
app.set("view engine", "ejs");
console.log(__dirname);
app.set("views", process.cwd() + "/src/views");
app.use(express.static(__dirname + "/public"));

app.use("/", rootRouter);
