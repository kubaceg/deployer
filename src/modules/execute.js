const exec = require('child_process').execSync

module.exports = {
  executeProjectCommands: function (projectConfig) {
    return new Promise(function (resolve, reject) {
      var outLog = ''
      try {
        for (var cmd in projectConfig.commands) {
          var out = exec(projectConfig.commands[cmd], {
            cwd: projectConfig.projectDir
          })
          outLog += out.toString()
        }
        resolve(outLog)
      } catch (err) {
        reject(err)
      }
    })
  }
}
