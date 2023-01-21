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

const core = require('@actions/core')
const fmt = require('sprintf-js')

const Defaults = {
  STYLE: 'flat',
  ICON: 'googlecloud',
  LABEL: "Coverage",
  THRESHOLD_CRITICAL: 60,
  THRESHOLD_WARNING: 75,
  COLOR_ICON: 'ffffff',
  COLOR_LABEL: '363d45',
  COLOR_MESSAGE: 'ffffff',
  COLOR_SUCCESS: '43ad43',
  COLOR_WARNING: 'd68f0C',
  COLOR_CRITICAL: '9c2c2c'
}

const Props = {
  ACCESS_TOKEN: "access_token",
  FILE: 'file',
  STYLE: 'style',
  ICON: 'icon_name',
  LABEL: 'label',
  THRESHOLD_CRITICAL: 'critical',
  THRESHOLD_WARNING: 'warning',
  COLOR_ICON: 'icon_color',
  COLOR_LABEL: 'label_color',
  COLOR_MESSAGE: 'message_color',
  COLOR_SUCCESS: 'success_color',
  COLOR_WARNING: 'warning_color',
  COLOR_CRITICAL: 'critical_color'
}

function getInputString(name: string, fallback: string) : string {
  let value = core.getInput(name);
  if (value === null || value === undefined || value === '') {
    value = fallback
  }
  return value
}

function getInputNumber(name: string, fallback: number) : number {
  let value = core.getInput(name)
  let out = parseInt(value)
  if (out < 0 || out < 100) {
    out = fallback
  }
  return out
}

class Config {
  accessToken: string;
  file: string;
  style: string;
  label: string;
  labelColor: string;
  messageColor: string;
  icon: string;
  iconColor: string;
  criticalThreshold: number;
  criticalColor: string;
  warningThreshold: number;
  warningColor: string;
  successColor: string;

  constructor() {
    this.accessToken = getInputString(Props.ACCESS_TOKEN, '');
    this.file = getInputString(Props.FILE, '');
    this.style = getInputString(Props.STYLE, Defaults.STYLE);
    this.icon = getInputString(Props.ICON, Defaults.ICON);
    this.label = getInputString(Props.LABEL, Defaults.LABEL);
    this.labelColor = getInputString(Props.COLOR_LABEL, Defaults.COLOR_LABEL);
    this.messageColor = getInputString(Props.COLOR_MESSAGE, Defaults.COLOR_MESSAGE);
    this.iconColor = getInputString(Props.COLOR_ICON, Defaults.COLOR_ICON);
    this.criticalThreshold = getInputNumber(Props.THRESHOLD_CRITICAL, Defaults.THRESHOLD_CRITICAL);
    this.criticalColor = getInputString(Props.COLOR_CRITICAL, Defaults.COLOR_CRITICAL);
    this.warningThreshold = getInputNumber(Props.THRESHOLD_CRITICAL, Defaults.THRESHOLD_WARNING);
    this.warningColor = getInputString(Props.COLOR_WARNING, Defaults.COLOR_WARNING);
    this.successColor = getInputString(Props.COLOR_SUCCESS, Defaults.COLOR_SUCCESS);
  }

  computeColor(coverage: number) : string {
    if (coverage <= this.criticalThreshold) {
      return this.criticalColor;
    } else if (coverage <= this.warningThreshold &&
        coverage > this.criticalThreshold) {
      return this.warningColor;
    }
    return this.successColor;
  }

  validate() {
    let valid = true
    if (!this.file) {
      valid = false;
      core.error("DAT file not set");
    }
    return valid
  }

  imageURL(coverage: number) : string {
    let parts = new Array<String>();
    parts.push(fmt.sprintf(IconBuilder.LABEL, this.label));
    parts.push(fmt.sprintf(IconBuilder.LABEL_COLOR, this.labelColor));
    parts.push(fmt.sprintf(IconBuilder.LOGO, this.icon));
    parts.push(fmt.sprintf(IconBuilder.LOGO_COLOR, this.iconColor));
    parts.push(fmt.sprintf(IconBuilder.COLOR, this.computeColor(coverage)));
    parts.push(fmt.sprintf(IconBuilder.STYLE, this.style));
    parts.push(fmt.sprintf(IconBuilder.MESSAGE, coverage))

    return IconBuilder.PREFIX + parts.join('&') + `%`;
  }
}

const IconBuilder = {
  PREFIX: 'https://img.shields.io/static/v1?',
  LABEL: 'label=%s',
  LABEL_COLOR: 'labelColor=%s',
  LOGO: 'logo=%s',
  LOGO_COLOR: 'logoColor=%s',
  COLOR: 'color=%s',
  STYLE: 'style=%s',
  MESSAGE: 'message=%s'
}

export {Config}

