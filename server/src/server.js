const http = require("http");

const app = require("./app");
const { loadPlanets } = require("./models/planets.model");
const mongoConnect = require("./services/mongo");

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

//We put the serer start in this function as the loadPlanets function requires await functionality,which is only possible in async functions.
async function startServer() {
  await mongoConnect();
  //This loads the planets data on startup.
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

startServer();
