import mongoose from "mongoose";

try {
  mongoose.connect(
    "mongodb+srv://tom:DGFQ6qIUTADEgWlf@cluster0.v4qfqfc.mongodb.net/test?retryWrites=true&w=majority"
  );
} catch (e) {
  console.log(e);
}
const db = mongoose.connection;

const handleOpen = () => console.log("connected");
db.once("open", handleOpen);
