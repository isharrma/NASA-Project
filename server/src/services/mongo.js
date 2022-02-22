const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://isharrma:Aman1999$.@nasa-api.4phwu.mongodb.net/nasa-api?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

module.exports = mongoConnect;
