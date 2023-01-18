import {Config, Props} from './config.js';
import {LcovStats} from './stats.js';

import core from '@actions/core';

function init() {
  return new Config(
      core.getInput(Props.ACCESS_TOKEN),
      core.getInput(Props.DAT_FILE),

      core.getInput(Props.RED),
      core.getInput(Props.YELLOW),
      core.getInput(Props.ICON)
  )
}

function evaluate() {
  try {
    !core.notice('Initializing Configuration')
    let config = init()

    if (!config.validate()) {
      core.error('Invalid Configuration, please check the logs')
      core.setFailed("Invalid Configuration")
    }

    let stats = new LcovStats(config.datFile)
    stats.read()

    core.exportVariable("COVERAGE_FUNCTIONS_FOUND", stats.functionsFound)
    core.exportVariable("COVERAGE_FUNCTIONS_HIT", stats.functionsHit)
    core.exportVariable("COVERAGE_LINES_FOUND", stats.linesFound)
    core.exportVariable("COVERAGE_LINES_HIT", stats.linesHit)
    core.exportVariable("COVERAGE_SCORE", stats.coverage())


    let label = "Coverage"
    let coverage = stats.coverage()
    let color = (coverage <= config.red) ? "red" :
        (coverage >= config.yellow && coverage < config.green) ? "yellow" : "green";
    let message = stats.coverage()
    core.exportVariable("COVERAGE_BADGE", `https://img.shields.io/badge/${label}-${message}-${color}?style=for-the-badge&logo=${config.icon}&logoColor=white`);
  } catch (error) {
    core.setFailed(error.message)
    return 1;
  }
  return 0
}

export { evaluate }
