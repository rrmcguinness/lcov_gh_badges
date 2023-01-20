import {Config} from './config';

import {LcovStats} from './stats';

import * as core from '@actions/core';

function evaluate() : number {
  try {
    core.notice('Initializing Configuration')
    let config = new Config();

    if (!config.validate()) {
      core.error('Invalid Configuration, please check the logs')
      core.setFailed("Invalid Configuration")
    }

    let stats = new LcovStats(config.file)
    stats.read()

    core.exportVariable("COVERAGE_FUNCTIONS_FOUND", stats.functionsFound)
    core.exportVariable("COVERAGE_FUNCTIONS_HIT", stats.functionsHit)
    core.exportVariable("COVERAGE_LINES_FOUND", stats.linesFound)
    core.exportVariable("COVERAGE_LINES_HIT", stats.linesHit)
    core.exportVariable("COVERAGE_SCORE", stats.coverage())

    let coverage = stats.coverage()

    core.exportVariable("COVERAGE_BADGE", config.imageURL(coverage));
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
    return 1;
  }
  return 0
}

export { evaluate }
