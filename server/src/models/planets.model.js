const { parse } = require("csv-parse");
const fs = require("fs");
const path = require("path");

const habitablePlanet = [];

function filterPlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

//This function loads the data on the server at startup,otherwise as the code runs asynchronously it would have been exported first and then the array would hve been populated.
function loadPlanets() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "..", "data", "kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (filterPlanet(data)) {
          habitablePlanet.push(data);
        }
      })
      .on("error", (error) => {
        console.log(error);
        reject(err);
      })
      .on("end", () => {
        console.log(`${habitablePlanet.length} have been found `);
        resolve();
      });
  });
}

function getAllPlanets() {
  return habitablePlanet;
}

module.exports = {
  loadPlanets,
  getAllPlanets,
};
