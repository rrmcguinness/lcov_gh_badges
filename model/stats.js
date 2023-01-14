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

import fs from "fs";

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
  constructor(line) {
    if (line.startsWith(LCOV.LINE_NUMBER_AND_HIT_COUNT)) {
      let startIndex = line.indexOf(TOKEN.COLON)+1;
      let values = line.substring(startIndex).split(TOKEN.COMMA)
      if (values.length === 2) {
        this.lineNumber = parseInt(values[0]);
        this.hitcount = parseInt(values[1])
      }
    }
  }
}

class FileStats {
  constructor(sourceFile) {
    sourceFile = sourceFile.substring(LCOV.SOURCE_FILE.length+1)
    this.sourceFile = sourceFile;
    this.functionsFound = 0;
    this.functionsHit = 0;
    this.linesFound = 0;
    this.linesHit = 0;
    this.lineNumberHitCounts = new Array()
  }
  InsertLineNumberHitCount(line) {
    this.lineNumberHitCounts.push(new LineNumberHitCount(line))
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
          this.functionsFound = parseInt(values[0]);
          break;
        case LCOV.FUNCTIONS_HIT:
          this.functionsHit = parseInt(values[0]);
          break;
        case LCOV.LINE_NUMBER_AND_HIT_COUNT:
          this.InsertLineNumberHitCount(line);
        case LCOV.LINES_FOUND:
          this.linesFound = parseInt(values[0]);
          break;
        case LCOV.LINES_HIT:
          this.linesHit = parseInt(values[0])
      }
    }
    return true;
  }
}

class LcovStats {
  constructor(fileName) {
    this.fileName = fileName;
    this.isRead = false;
    this.totalLinesFound = 0;
    this.totalLinesHit = 0;
    this.totalFunctionsFound = 0;
    this.totalFunctionsHit = 0;
    this.fileStats = new Array();
  }
  read() {
    if (!this.isRead) {
      let content = fs.readFileSync(this.fileName, 'utf-8')
      let fileStats = null;
      content.split(/\r?\n/).forEach(line => {
        if (line.startsWith(LCOV.SOURCE_FILE)) {
          fileStats = new FileStats(line)
        }
        if (!fileStats.evaluate(line)) {
          this.fileStats.push(fileStats);
          this.totalLinesFound += fileStats.linesFound;
          this.totalLinesHit += fileStats.linesHit;
          this.totalFunctionsFound += fileStats.functionsFound;
          this.totalFunctionsHit += fileStats.functionsHit
        }
      });
      this.isRead = true
    } else {
      process.stdout.write(`Attempted to read file ${this.fileName} again`)
    }
  }

  coverage() {
    return Math.round((this.totalLinesHit / this.totalLinesFound)*100);
  }
}

export { LcovStats }