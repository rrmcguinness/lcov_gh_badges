import {describe} from 'mocha';
import {run} from "../src";
import {SetupActionEnvironmentFromArgv} from './test_util';


describe("Main Test", function() {
  SetupActionEnvironmentFromArgv();
  let promise = run()
})