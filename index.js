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

const core = require('@actions/core');
const runner = require('./lib/runner');

async function run() {
  core.setCommandEcho(true)
  let run = runner.evaluate();
  if (run != 0) {
    core.setOutput("COVERAGE_STATUS", false)
  } else {
    core.setOutput("COVERAGE_STATUS", true)
  }
}