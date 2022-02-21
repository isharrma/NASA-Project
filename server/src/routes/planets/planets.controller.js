const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  return res.status(200).json(await getAllPlanets());
  //Its better to return explicity so that the code doesnt run into any bugs
}

module.exports = {
  httpGetAllPlanets,
};
