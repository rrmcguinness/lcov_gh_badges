import {Config} from './config';

import {LcovStats} from './stats';

import * as core from '@actions/core';

import * as http from '@actions/http-client';

import * as fs from 'fs';

import * as fmt from 'sprintf-js';

function generateBadge(badgeURL : string)  {
  let client: http.HttpClient = new http.HttpClient()
  client.get(badgeURL).then(r => {
    r.readBody().then(b => {
      fs.writeFile("coverage.svg", b, (err) => {
        if (err) {
          core.error(fmt.sprintf("Failed to write file: coverage.svg with error: %s\n", err));
        } else {
          core.info(fmt.sprintf("Created file: coverage.svg"));
        }
      })
    })
  })
}

const Outputs = {
  COVERAGE_FUNCTIONS_FOUND: 'coverage_functions_found',
  COVERAGE_FUNCTIONS_HIT: 'coverage_functions_hit',
  COVERAGE_LINES_FOUND: 'coverage_lines_found',
  COVERAGE_LINES_HIT: 'coverage_lines_hit',
  COVERAGE_SCORE: 'coverage_score',
  COVERAGE_BADGE_URL: 'coverage_badge_url',
}

function evaluate() : number {
  try {
    let config = new Config();

    if (!config.validate()) {
      core.error('Invalid Configuration, please check the logs');
      core.setFailed("Invalid Configuration");
    }

    let stats = new LcovStats(config.file);
    stats.read();

    let coverage = stats.coverage();
    let badgeURL = config.imageURL(coverage);

    generateBadge(badgeURL)

    core.setOutput(Outputs.COVERAGE_FUNCTIONS_FOUND, stats.functionsFound);
    core.setOutput(Outputs.COVERAGE_FUNCTIONS_HIT, stats.functionsHit);
    core.setOutput(Outputs.COVERAGE_LINES_FOUND, stats.linesFound);
    core.setOutput(Outputs.COVERAGE_LINES_HIT, stats.linesHit);
    core.setOutput(Outputs.COVERAGE_SCORE, coverage);
    core.setOutput(Outputs.COVERAGE_BADGE_URL, badgeURL);

  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message);
    }
    return core.ExitCode.Failure;
  }
  return core.ExitCode.Success;
}

export { evaluate }
