// A data structure for LCOV Stats
const Stats = {
  totalFiles: 0,
  totalLines: 0,
  totalInstrumentedLines: 0,
  testedLines: 0,
  incrementFiles(){
    this.totalFiles += 1;
  },
  incrementLines() {
    this.totalLines += 1
  },
  incrementInstrumentedLines() {
    this.totalInstrumentedLines += 1
  },
  incrementLinesTested() {
    this.testedLines += 1
  },
  getCoverage() {
    if (this.testedLines > 0 && this.totalInstrumentedLines > 0) {
      return this.testedLines / this.totalInstrumentedLines
    } else {
      return 0
    }
  }
}