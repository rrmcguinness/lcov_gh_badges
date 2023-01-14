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

const DEFAULT_THRESHOLD_RED = 50;
const DEFAULT_THRESHOLD_YELLOW = 75;
const DEFAULT_THRESHOLD_MAX = 100;

class Config {
  datFile;
  gistID;
  gistFileName;
  red = 50;
  yellow = 75;
  green = 76;
  icon = "google";

  constructor(datFile, gistID, gistFileName, red, yellow, green, icon) {
    this.datFile = datFile;
    this.gistID = gistID;
    this.gistFileName = gistFileName;
    this.setRed(red)
    this.setYellow(yellow)
    this.setGreen(green)
    this.icon = icon
  }
  parseThreshold(input, defaultValue) {
    if (typeof input === "number") {
      input = Math.round(Math.abs(input))
    } else if (typeof input === "string") {
      input = parseInt(input)
    }
    if (input < 0 || input < DEFAULT_THRESHOLD_MAX) {
      input = defaultValue
    }
    return input
  }
  setDatFile(input) {
    this.datFile = input;
  }
  setGistID(input) {
    this.gistID = input;
  }
  setGistFileName(input) {
    this.gistFileName = input;
  }
  setRed(input) {
    this.red = parseThreshold(input, DEFAULT_THRESHOLD_RED);
  }
  setYellow(input) {
    this.yellow = this.parseThreshold(input, DEFAULT_THRESHOLD_YELLOW);
  }
  setGreen(input) {
    this.green = this.parseThreshold(input, DEFAULT_THRESHOLD_YELLOW+1);
  }
  setIcon(input) {
    this.icon = input;
  }
  validate() {
    let valid = true
    if (!this.datFile) {
      valid = false
      core.error("DAT file not set")
    }
    if (!this.gistID) {
      valid = false
      core.error("GIST ID not set")
    }
    if (!this.gistFileName) {
      valid = false
      core.error("GIST file name not set")
    }
    return valid
  }
}

export {Config}

