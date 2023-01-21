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
exports.evaluate = void 0;
const config_1 = require("./config");
const stats_1 = require("./stats");
const core = __importStar(require("@actions/core"));
const http = __importStar(require("@actions/http-client"));
const fs = __importStar(require("fs"));
const fmt = __importStar(require("sprintf-js"));
function generateBadge(badgeURL) {
    let client = new http.HttpClient();
    client.get(badgeURL).then((r) => {
        r.readBody().then((b) => {
            fs.writeFile("coverage.svg", b, (err) => {
                if (err) {
                    core.error(fmt.sprintf("Failed to write file: coverage.svg with error: %s\n", err));
                }
                else {
                    core.info(fmt.sprintf("Created file: coverage.svg"));
                }
            });
        });
    });
}
const Outputs = {
    COVERAGE_FUNCTIONS_FOUND: 'coverage_functions_found',
    COVERAGE_FUNCTIONS_HIT: 'coverage_functions_hit',
    COVERAGE_LINES_FOUND: 'coverage_lines_found',
    COVERAGE_LINES_HIT: 'coverage_lines_hit',
    COVERAGE_SCORE: 'coverage_score',
    COVERAGE_BADGE_URL: 'coverage_badge_url',
};
function evaluate() {
    try {
        let config = new config_1.Config();
        if (!config.validate()) {
            core.error('Invalid Configuration, please check the logs');
            core.setFailed("Invalid Configuration");
        }
        // Compute the statistics
        let stats = new stats_1.LcovStats(config.file);
        let coverage = stats.coverage();
        // Generate the badge URL
        let badgeURL = config.imageURL(coverage);
        // Generate the Badge File
        generateBadge(badgeURL);
        // Set Output
        core.setOutput(Outputs.COVERAGE_FUNCTIONS_FOUND, stats.functionsFound);
        core.setOutput(Outputs.COVERAGE_FUNCTIONS_HIT, stats.functionsHit);
        core.setOutput(Outputs.COVERAGE_LINES_FOUND, stats.linesFound);
        core.setOutput(Outputs.COVERAGE_LINES_HIT, stats.linesHit);
        core.setOutput(Outputs.COVERAGE_SCORE, coverage);
        core.setOutput(Outputs.COVERAGE_BADGE_URL, badgeURL);
    }
    catch (e) {
        if (e instanceof Error) {
            core.setFailed(e.message);
        }
        return core.ExitCode.Failure;
    }
    return core.ExitCode.Success;
}
exports.evaluate = evaluate;
