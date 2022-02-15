const express = require("express");
const {
  httpGetAllLaunches,
  httpAddNewLaunch,
  httpAbortLaunch,
} = require("./launches.controller");

const launchRouter = express.Router();

launchRouter.get("/launches", httpGetAllLaunches);
launchRouter.post("/launches", httpAddNewLaunch);
launchRouter.delete("/launches/:id", httpAbortLaunch);

module.exports = launchRouter;
