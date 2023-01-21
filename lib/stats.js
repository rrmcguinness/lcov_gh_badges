"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LcovStats = void 0;
const fs = __importStar(require("fs"));
const LCOV = {
    SOURCE_FILE: 'SF',
    FUNCTIONS_FOUND: 'FNF',
    FUNCTIONS_HIT: 'FNH',
    LINES_FOUND: 'LF',
    LINES_HIT: 'LH',
    LINE_NUMBER_AND_HIT_COUNT: 'DA',
    END_OF_RECORD: 'end_of_record'
};
const TOKEN = {
    COLON: ':',
    COMMA: ','
};
class LineNumberHitCount {
    constructor(input) {
        this.lineNumber = 0;
        this.hitCount = 0;
        if (input.startsWith(LCOV.LINE_NUMBER_AND_HIT_COUNT)) {
            let startIndex = input.indexOf(TOKEN.COLON) + 1;
            let values = input.substring(startIndex).split(TOKEN.COMMA);
            if (values.length === 2) {
                this.lineNumber = parseInt(values[0]);
                this.hitCount = parseInt(values[1]);
            }
        }
    }
}
class FileStats {
    constructor(sourceFile) {
        this.functionsFound = 0;
        this.functionsHit = 0;
        this.linesFound = 0;
        this.linesHit = 0;
        this.lineNumberHitCounts = new Array();
        sourceFile = sourceFile.substring(LCOV.SOURCE_FILE.length + 1);
        this.sourceFile = sourceFile;
    }
    insertLineNumberHitCount(line) {
        this.lineNumberHitCounts.push(new LineNumberHitCount(line));
    }
    evaluate(line) {
        if (line.startsWith(LCOV.END_OF_RECORD)) {
            return false;
        }
        else {
            let colonIndex = line.indexOf(TOKEN.COLON);
            let token = line.substring(0, colonIndex);
            let values = line.substring(colonIndex + 1).split(TOKEN.COMMA);
            switch (token) {
                case LCOV.FUNCTIONS_FOUND:
                    this.functionsFound = parseInt(values[0]);
                    break;
                case LCOV.FUNCTIONS_HIT:
                    this.functionsHit = parseInt(values[0]);
                    break;
                case LCOV.LINE_NUMBER_AND_HIT_COUNT:
                    this.insertLineNumberHitCount(line);
                case LCOV.LINES_FOUND:
                    this.linesFound = parseInt(values[0]);
                    break;
                case LCOV.LINES_HIT:
                    this.linesHit = parseInt(values[0]);
            }
        }
        return true;
    }
}
class LcovStats {
    constructor(fileName) {
        this.processed = false;
        this.linesFound = 0;
        this.linesHit = 0;
        this.functionsFound = 0;
        this.functionsHit = 0;
        this.fileStats = new Array();
        this.fileName = fileName;
    }
    read() {
        if (!this.processed) {
            let content = fs.readFileSync(this.fileName, 'utf-8');
            let fileStats;
            content.split(/\r?\n/).forEach(line => {
                if (line.startsWith(LCOV.SOURCE_FILE)) {
                    fileStats = new FileStats(line);
                }
                if (!fileStats.evaluate(line)) {
                    this.fileStats.push(fileStats);
                    this.linesFound += fileStats.linesFound;
                    this.linesHit += fileStats.linesHit;
                    this.functionsFound += fileStats.functionsFound;
                    this.functionsHit += fileStats.functionsHit;
                }
            });
            this.processed = true;
        }
        else {
            process.stdout.write(`Attempted to read file ${this.fileName} again`);
        }
    }
    coverage() {
        let out = Math.round((this.linesHit / this.linesFound) * 100);
        if (isNaN(out)) {
            out = 0;
        }
        return out;
    }
}
exports.LcovStats = LcovStats;
