const fs = require('fs');
const SF = 'Source File'
const FNF = 'Number of Functions Found'
const FNH = 'Number of Functions Hit'
const DA = 'Instrumented Line'
const LH = 'Line Count Executed'
const LF = 'Total Lines Instrumented'

// Primary LCOV Data Parser
const Parser = {
  lcovFile: "",
  read() {
    let stats = Object.create(Stats)
    fs.readFile(this.lcovFile, 'UTF8', (err, data) => {
      if (err) {
        throw err
      } else {
        lines = data.split("\n")

      }
    })
    return stats
  }
}
