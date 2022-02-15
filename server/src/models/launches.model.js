const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler exploration X",
  rocket: "Explorer IS1",
  launchDate: new Date("December 27,2030"),
  target: "Kepler 442 b",
  customer: ["NASA", "SpaceX"],
  upcomig: true,
  sucess: true,
};

launches.set(launch.flightNumber, launch);

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(launch) {
  latestFlightNumber++;
  launches.set(
    latestFlightNumber,
    Object.assign(launch, {
      success: true,
      upcoming: true,
      customers: ["NASA", "SpaceX"],
      flightNumber: latestFlightNumber,
    })
  );
}

function existsLaunchId(launchId) {
  return launches.has(launchId);
}

function abortLaunchById(launchId) {
  const abort = launches.get(launchId);
  abort.upcoming = false;
  abort.success = false;
  return abort;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchId,
  abortLaunchById,
};
