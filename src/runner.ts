import {Config} from './config';

import {LcovStats} from './stats';

import * as core from '@actions/core';

import * as http from '@actions/http-client';

import * as fs from 'fs';

import * as fmt from 'sprintf-js';

function getBody(badgeURL : string)  {
  let client: http.HttpClient = new http.HttpClient()
  process.stdout.write("Fetching URL: " + badgeURL)
  client.get(badgeURL).then(r => {
    process.stdout.write("" + r.message.statusCode + "\n\n")
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

function evaluate() : number {
  try {
    core.notice('Initializing Configuration')
    let config = new Config();

    if (!config.validate()) {
      core.error('Invalid Configuration, please check the logs');
      core.setFailed("Invalid Configuration");
    }

    let stats = new LcovStats(config.file);
    stats.read();

    let coverage = stats.coverage();
    let badgeURL = config.imageURL(coverage);

    core.exportVariable("COVERAGE_FUNCTIONS_FOUND", stats.functionsFound);
    core.exportVariable("COVERAGE_FUNCTIONS_HIT", stats.functionsHit);
    core.exportVariable("COVERAGE_LINES_FOUND", stats.linesFound);
    core.exportVariable("COVERAGE_LINES_HIT", stats.linesHit);
    core.exportVariable("COVERAGE_SCORE", coverage);
    core.exportVariable("COVERAGE_BADGE", badgeURL);

    let body = getBody(badgeURL)
    process.stdout.write(body + "\n\n");

  } catch (e) {
    if (e instanceof Error) {
      core.setFailed(e.message);
    }
    return 1;
  }
  return 0
}

export { evaluate }
