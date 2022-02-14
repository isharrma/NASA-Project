const { planets } = require("../../models/planets.model");

function getAllPlanets(req, res) {
  return res.status(200).json(planets);
  //Its better to return explicity so that the code doesnt run into any bugs
}

module.exports = {
  getAllPlanets,
};
