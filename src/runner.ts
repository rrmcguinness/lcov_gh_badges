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
    let color = config.computeColor(coverage)

    // https://img.shields.io/static/v1?label=Coverage&message=80%&style=flat&logo=googlecloud&logoColor=ffffff&labelColor=363D45&color=43AD43
    core.exportVariable("COVERAGE_BADGE", `https://img.shields.io/static/v1?label=${config.label}&message=${coverage}%&color=${config.messageColor}&style=${config.style}&logo=${config.icon}&logoColor=${config.iconColor}`);
  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message)
    }
    return 1;
  }
  return 0
}

export { evaluate }
