const core = require('@actions/core');
const Config = {
  dataFile: "",
  gistID: "",
  gistFileName: "",
  red: 50,
  yellow: 75,
  green: 76,
  icon: "google",
  Validate() {
    let valid = true
    if (!this.datFile) {
      valid = false
      core.error("DAT file not set")
    }
    if (!this.gistID) {
      valid = false
      core.error("GIST ID not set")
    }
    if (!this.gistFileName) {
      valid = false
      core.error("GIST file name not set")
    }
    return valid
  }
}
