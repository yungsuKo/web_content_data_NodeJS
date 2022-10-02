import mongoose from "mongoose";

try {
  mongoose.connect(
    "mongodb+srv://tom:DGFQ6qIUTADEgWlf@cluster0.v4qfqfc.mongodb.net/?retryWrites=true&w=majority"
  );
  const db = mongoose.connection;

  const handleOpen = () => console.log("connected");
  db.once("open", handleOpen);
} catch (e) {
  console.log(e);
}
