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

// A data structure for LCOV Stats

import fs from 'fs';

const LCOV = {
  SOURCE_FILE: 'SF', // SF:pkg/proto/annotation.go
  FUNCTIONS_FOUND: 'FNF', //FNF:0
  FUNCTIONS_HIT: 'FNH', // FNH:0
  LINES_FOUND: 'LF', // LF:12
  LINES_HIT: 'LH', //LH:12
  LINE_NUMBER_AND_HIT_COUNT: 'DA', // DA:28,1
  END_OF_RECORD: 'end_of_record' // end_of_record
}

const TOKEN = {
  COLON: ':',
  COMMA: ','
}

class LineNumberHitCount {
  constructor() {
    this._lineNumber = 0;
    this._hitCount = 0;
  }
  set lineNumber(input) {
    this._lineNumber = input
  }
  get lineNumber() {
    return this._lineNumber;
  }
  get hitCount() {
    return this._hitCount;
  }
  set hitCount(input) {
    this._hitCount = input;
  }
  fromString(input) {
    if (input.startsWith(LCOV.LINE_NUMBER_AND_HIT_COUNT)) {
      let startIndex = input.indexOf(TOKEN.COLON)+1;
      let values = input.substring(startIndex).split(TOKEN.COMMA)
      if (values.length === 2) {
        this.lineNumber = parseInt(values[0]);
        this.hitCount = parseInt(values[1])
      }
    }
  }
}

class FileStats {
  constructor(sourceFile) {
    sourceFile = sourceFile.substring(LCOV.SOURCE_FILE.length+1)
    this._sourceFile = sourceFile;
    this._functionsFound = 0;
    this._functionsHit = 0;
    this._linesFound = 0;
    this._linesHit = 0;
    this._lineNumberHitCounts = []
  }

  get sourceFile() {
    return this._sourceFile;
  }

  get functionsFound() {
    return this._functionsFound;
  }

  get functionsHit() {
    return this._functionsHit;
  }

  get linesFound() {
    return this._linesFound;
  }

  get linesHit() {
    return this._linesHit;
  }

  insertLineNumberHitCount(line) {
    this._lineNumberHitCounts.push(new LineNumberHitCount(line))
  }

  evaluate(line) {
    if (line.startsWith(LCOV.END_OF_RECORD)) {
      return false;
    } else {
      let colonIndex = line.indexOf(TOKEN.COLON)
      let token = line.substring(0, colonIndex)
      let values = line.substring(colonIndex+1).split(TOKEN.COMMA)
      switch (token) {
        case LCOV.FUNCTIONS_FOUND:
          this._functionsFound = parseInt(values[0]);
          break;
        case LCOV.FUNCTIONS_HIT:
          this._functionsHit = parseInt(values[0]);
          break;
        case LCOV.LINE_NUMBER_AND_HIT_COUNT:
          this.insertLineNumberHitCount(line);
        case LCOV.LINES_FOUND:
          this._linesFound = parseInt(values[0]);
          break;
        case LCOV.LINES_HIT:
          this._linesHit = parseInt(values[0])
      }
    }
    return true;
  }
}

class LcovStats {
  constructor(fileName) {
    this._isRead = false;
    this._totalLinesFound = 0;
    this._totalLinesHit = 0;
    this._totalFunctionsFound = 0;
    this._totalFunctionsHit = 0;
    this._fileStats = [];
    this._fileName = fileName;
  }

  get fileName() {
    return this._fileName;
  }

  get linesFound() {
    return this._totalLinesFound;
  }

  get linesHit() {
    return this._totalLinesHit;
  }

  get functionsFound() {
    return this._totalFunctionsFound;
  }

  get functionsHit() {
    return this._totalFunctionsHit;
  }

  get fileStats() {
    return this._fileStats;
  }

  read() {
    if (!this._isRead) {
      let content = fs.readFileSync(this._fileName, 'utf-8')
      let fileStats = null;
      content.split(/\r?\n/).forEach(line => {
        if (line.startsWith(LCOV.SOURCE_FILE)) {
          fileStats = new FileStats(line)
        }
        if (!fileStats.evaluate(line)) {
          this._fileStats.push(fileStats);
          this._totalLinesFound += fileStats.linesFound;
          this._totalLinesHit += fileStats.linesHit;
          this._totalFunctionsFound += fileStats.functionsFound;
          this._totalFunctionsHit += fileStats.functionsHit
        }
      });
      this._isRead = true
    } else {
      process.stdout.write(`Attempted to read file ${this._fileName} again`)
    }
  }

  coverage() {
    let out = Math.round((this._totalLinesHit / this._totalLinesFound)*100);
    if (isNaN(out)) {
      out = 0;
    }
    return out;
  }
}

export { LcovStats }