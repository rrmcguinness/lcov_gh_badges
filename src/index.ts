/*
 * Copyright 2023 Google, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as core from '@actions/core';
import {Config} from "./config";
import {LcovStats} from "./stats";
import {Outputs} from "./constants";
import {generateBadge, writeToGitHub} from "./utils";

async function run() {
  try {
    let config = new Config();

    if (!config.validate()) {
      core.error('Invalid Configuration, please check the logs');
      core.setFailed("Invalid Configuration");
    }

    // Compute the statistics
    let stats = new LcovStats(config.file);
    let coverage = stats.coverage();

    // Generate the badge URL
    let badgeURL = config.imageURL(coverage);

    // Generate the Badge File
    generateBadge(badgeURL)
    process.stdout.write("Generated Badge\n");

    // Set Output
    core.setOutput(Outputs.COVERAGE_FUNCTIONS_FOUND, stats.functionsFound);
    core.setOutput(Outputs.COVERAGE_FUNCTIONS_HIT, stats.functionsHit);
    core.setOutput(Outputs.COVERAGE_LINES_FOUND, stats.linesFound);
    core.setOutput(Outputs.COVERAGE_LINES_HIT, stats.linesHit);
    core.setOutput(Outputs.COVERAGE_SCORE, coverage);
    core.setOutput(Outputs.COVERAGE_BADGE_URL, badgeURL);

    writeToGitHub(config)
  } catch (e) {
    if (e instanceof Error) {
      core.error("Failed execution of the executor");
      core.setOutput("COVERAGE_STATUS", false);
    } else {
      core.notice("Coverage Complete");
      core.setOutput("COVERAGE_STATUS", true);
    }
  }
}

export{run}

run();