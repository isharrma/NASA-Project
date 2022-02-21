const http = require("http");
const mongoose = require("mongoose");

const app = require("./app");
const { loadPlanets } = require("./models/planets.model");

const PORT = process.env.PORT || 8000;

const MONGO_URL =
  "mongodb+srv://isharrma:Aman1999$.@nasa-api.4phwu.mongodb.net/nasa-api?retryWrites=true&w=majority";

const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("MongoDB Connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});
//We put the serer start in this function as the loadPlanets function requires await functionality,which is only possible in async functions.
async function startServer() {
  //This loads the planets data on startup.
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

startServer();
