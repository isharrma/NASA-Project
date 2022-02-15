const {
  getAllLaunches,
  addNewLaunch,
  existsLaunchId,
  abortLaunchById,
} = require("../../models/launches.model");

// Displays all the launches
function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

// Add new launches after taking input from user
function httpAddNewLaunch(req, res) {
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing required launch property. ",
    });
  }

  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Not a valid date",
    });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

// Aborts the launch
function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if (!existsLaunchId(launchId)) {
    return res.status(400).json({
      error: "Launch not found.",
    });
  }

  const aborted = abortLaunchById(launchId);
  return res.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
