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

const github = require('@actions/github');
const core = require('@actions/core');
const lcov = require('model/lcov')
const config = require('model/config')
const {Config} = require('./model/config');
const {LcovStats} = require('./model/stats');


function init() {
  return new Config(
      core.getInput(config.Props.ACCESS_TOKEN),
      core.getInput(config.Props.DAT_FILE),
      core.getInput(config.Props.GIST_ID),
      core.getInput(config.Props.RED),
      core.getInput(config.Props.YELLOW),
      core.getInput(config.Props.ICON)
  )
}

async function run() {
  // This is the primary method of the lcov_gh_badges program. Here, we will
  // read the dat file, and compute the statistics. Once complete, the
  // stats will be pushed into environment variables.

  try {
    let config = init()

    if (!config.validate()) {
      core.setFailed("Invalid Configuration")
    }

    let stats = new LcovStats(config.datFile)

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
    core.exportVariable("COVERAGE_BADGE", `https://img.shields.io/badge/${label}-${message}-${color}`);
  } catch (error) {
    core.setFailed(error.message)
  }
}