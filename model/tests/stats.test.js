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


import {LcovStats} from '../stats.js'

describe("Read a File", function() {
    // This requires npm test to be run from the root directory.
    let p = new LcovStats("model/tests/coverage.dat");
    try {
        p.read();
        process.stdout.write(`Stats: ${p.coverage()}`);
    } catch (err) {
        process.stdout.write("Error reading file: " + err.message)
    }
})