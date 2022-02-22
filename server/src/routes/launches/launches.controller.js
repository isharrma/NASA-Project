const {
  getAllLaunches,
  abortLaunchById,
  scheduleNewLaunch,
  existsLaunchWithId,
} = require("../../models/launches.model");

// Displays all the launches
async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

// Add new launches after taking input from user
async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

// Aborts the launch
async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  const existLaunch = await existsLaunchWithId(launchId);
  if (!existLaunch) {
    return res.status(400).json({
      error: "Launch not found.",
    });
  }

  const aborted = abortLaunchById(launchId);
  if (!aborted) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
