import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/content_crawling");
const db = mongoose.connection;

const handleOpen = () => console.log("connected");
db.once("open", handleOpen);
