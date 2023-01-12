const github = require('@actions/github');
const core = require('@actions/core');
const lcov = require('model/lcov')
const config = require('model/config')


function getRed() {
  let red = parseInt(core.getInput("red"))
  if (red <= 0 || red > 100) {
    red = 60;
  }
  return red;
}

function getYellow() {
  let yellow = parseInt(core.getInput("yellow"))
  if (yellow <= 0 || yellow > 100) {
    yellow = 75
  }
  return yellow;
}

function init() {
  let cfg = Object.create(config.Config)
  // Initialize the input variables
  cfg.datFile = core.getInput("datFile");
  cfg.gistID = core.getInput("gistID");
  cfg.gistFileName = core.getInput("gistFileName");
  cfg.red = getRed();
  cfg.yellow = getYellow();
  cfg.green = cfg.yellow + 1;
  cfg.icon = core.getInput("icon");
  return cfg
}

async function run() {
  // This is the primary method of the lcov_gh_badges program. Here, we will
  // read the dat file, and compute the statistics. Once complete, the
  // stats will be pushed into environment variables.

  try {
    let config = init()

    if (!config.Validate()) {
      core.setFailed("Invalid Configuration")
    }

    let stats = Object.create(lcov.Parser(lcovFile=config.dataFile))

    core.exportVariable("COVERAGE_LINES_TESTED", stats.testedLines)
    core.exportVariable("COVERAGE_LINES_TOTAL", stats.totalLines)
    core.exportVariable("COVERAGE_LINES_INSTRUMENTED", stats.totalInstrumentedLines)
    core.exportVariable("COVERAGE_FILES_TOTAL", stats.totalFiles)
    core.exportVariable("COVERAGE_SCORE", stats.getCoverage())
  } catch (error) {
    core.setFailed(error.message)
  }


}