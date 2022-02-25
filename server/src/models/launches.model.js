const axios = require("axios");
const launchesDatabase = require("./launches.mongo");
const planets = require("./planets.mongo");

const DEFAULT_FLIGHT_NUMBER = 100;
// const launch = {
//   flightNumber: 100,
//   mission: "Kepler exploration X",
//   rocket: "Explorer IS1",
//   launchDate: new Date("December 27,2030"),
//   target: "Kepler-442 b",
//   customer: ["NASA", "SpaceX"],
//   upcoming: true,
//   success: true,
// };
// saveLaunch(launch);

const SPACEX_URL = "https://api.spacexdata.com/v4/launches/query";

//Desc: Requests the API and popuates the data.
async function populateLaunches() {
  console.log("Downloading....");
  const response = await axios.post(SPACEX_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading the launches.");
    throw new Error("Launch data download fail");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => {
      return payload["customers"];
    });
    const spacexLaunch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      customer: customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };
    console.log(`${spacexLaunch.flightNumber} to ${spacexLaunch.mission}`);
    await saveLaunch(spacexLaunch);
  }
}

//Desc: Checks if the launches has been loaded,if not then populates the launches data from SpaceX API.
async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });
  if (firstLaunch) {
    console.log("Launch data loaded..");
    return;
  } else {
    await populateLaunches();
  }
}

//Desc: Filters out a launch.
// Input: Filter object
// Output: Return the JSON of the found launch
async function findLaunch(filter) {
  return await launchesDatabase.findOne(filter);
}

//Desc: Checks if there exists a launch with a given launchID.
//Input: Unique launhc ID
//Output: JSON of found  launch
async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

//Desc: Find the last launchID of the mission.
async function getLatestFlightNumber() {
  const latestLaunch = await launchesDatabase.findOne({}).sort("-flightNumber");

  if (!latestLaunch) return DEFAULT_FLIGHT_NUMBER;

  return latestLaunch.flightNumber;
}

//Desc: Returns all the launches in the databse.
async function getAllLaunches(skip, limit) {
  return launchesDatabase
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: -1 })
    .skip(skip)
    .limit(limit);
}

//Desc:Stores the launch and the spacex api launches in databse.
//Input: Launch JSON.
//Output: Saves the JSON in the databse.
async function saveLaunch(launch) {
  await launchesDatabase.updateOne(
    {
      flightNumber: launch.flightNumber,
    },
    launch,
    {
      upsert: true,
    }
  );
}

//Desc: Schedules a new launch.
async function scheduleNewLaunch() {
  //Check condition for the launch being scheduled for a habitable planet.
  const planet = await planets.findOne({
    keplerName: launch.target,
  });

  if (!planet) {
    throw new Error("No matching planet found!");
  }

  const newFlightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    success: true,
    upcoming: true,
    customers: ["NASA", "SpaceX"],
    flightNumber: newFlightNumber,
  });
  await saveLaunch(newLaunch);
}

//Desc:Abort a launch.
//Input: Unique launch ID.
//Otput: JSON of aborted launch.
async function abortLaunchById(launchId) {
  const aborted = await launchesDatabase.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  return aborted.modifiedCount === 1;
}

module.exports = {
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchWithId,
  abortLaunchById,
  loadLaunchData,
};
