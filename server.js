const express = require("express");

const app = express();
const port = 4000;

const handleListening = () =>
  console.log(`✅ server listening from http://localhost:${port} 🚀`);

app.listen(port, handleListening);
app.get("/", (req, res) => res.send("you can start"));
