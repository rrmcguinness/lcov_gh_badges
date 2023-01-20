import {evaluate} from '../src/runner';
import {describe} from 'mocha';

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
  if (process.env['INPUT_FILE'] === undefined) {
    process.env['INPUT_FILE'] = "__test__/coverage.dat"
  }
}

describe("Main Test", function() {
  SetupActionEnvironmentFromArgv();
  let promise = new Promise(evaluate);
})