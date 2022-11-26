const mongoose = require("mongoose");

mongoose.connect(process.env.MONGODB_KEY);
const db = mongoose.connection;

const handleOpen = () => console.log("connected");
db.once("open", handleOpen);
db.once("error", (err) => {
  throw "failed connect to MongoDB";
});

// ------------------------
