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

import core from '@actions/core';

const DEFAULT_THRESHOLD_RED = 50;
const DEFAULT_THRESHOLD_YELLOW = 75;
const DEFAULT_THRESHOLD_MAX = 100;
const DEFAULT_ICON_DIR = 'assets/coverage';
const DEFAULT_ICON = 'googlecloud';

const JSTypes = {
  STRING: "string",
  NUMBER: "number"
}

const Props = {
  ACCESS_TOKEN: "access_token",
  DAT_FILE: "dat_file",
  RED: "red",
  YELLOW: "yellow",
  GREEN: "green",
  ICON_DIR: "icon_dir",
  ICON: "icon",
}

class Config {
  constructor(accessToken, datFile, gistID, red, yellow, icon) {
    this._accessToken = accessToken;
    this._datFile = datFile;
    this._red = DEFAULT_THRESHOLD_RED;
    this._yellow = DEFAULT_THRESHOLD_YELLOW;
    this._green = DEFAULT_THRESHOLD_YELLOW + 1;
    this._iconDir = DEFAULT_ICON_DIR;
    this._icon = DEFAULT_ICON;

    // Call initializers on input
    this.red = red;
    this.yellow = yellow;
    this.green = this._yellow+1;
    this.icon = icon;
  }

  _parseThreshold(input, defaultValue) {
    if (typeof input === JSTypes.NUMBER) {
      input = Math.round(Math.abs(input))
    } else if (typeof input === JSTypes.STRING) {
      input = parseInt(input)
    }
    if (input < 0 || input < DEFAULT_THRESHOLD_MAX) {
      input = defaultValue
    }
    return input
  }
  get accessToken() {
    return this._accessToken;
  }
  get datFile() {
    return this._datFile;
  }
  get red() {
    return this._red;
  }
  set red(input) {
    this._red = this._parseThreshold(input, DEFAULT_THRESHOLD_RED);
  }
  set yellow(input) {
    this._yellow = this._parseThreshold(input, DEFAULT_THRESHOLD_YELLOW);
  }
  get yellow() {
    return this._yellow;
  }
  set green(input) {
    if (input <= this._yellow) {
      input = this._yellow + 1;
    }
    this._green = this._parseThreshold(input, DEFAULT_THRESHOLD_YELLOW+1);
  }
  get green() {
    return this._green;
  }
  set icon(input) {
    if (input !== undefined && input !== null && input !== '') {
      this._icon = input;
    }
  }
  set iconDir(input) {
    if (input !== undefined && input !== null && input !== '') {
      this._iconDir = input;
    }
  }
  get icon() {
    return this._icon;
  }
  validate() {
    let valid = true
    if (!this._datFile) {
      valid = false;
      core.error("DAT file not set");
    }
    if (!this._gistID) {
      valid = false;
      core.error("GIST ID not set");
    }
    return valid
  }
}

export {Props, Config}

