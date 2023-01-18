import * as core from '@actions/core';
import github from '@actions/github';
import {evaluate} from '../runner.js';

function SetupActionEnvironmentFromArgv() {
  process.argv.forEach(function (val, index, array) {
    if (index > 0) {
      let previousKey = array[index-1]
      if (previousKey.startsWith("--")) {
        previousKey = previousKey.substring(2);
      }
      let processKey = `INPUT_${previousKey.replace(/ /g, '_').toUpperCase()}`
      process.env[processKey] = val
    }
  })
}

describe("Main Test", function() {
  SetupActionEnvironmentFromArgv();
  let promise = new Promise(evaluate);
})