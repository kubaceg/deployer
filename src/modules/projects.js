var path = require('path')
const fs = require('fs')
const yaml = require('js-yaml')

module.exports = {
  getProjectsConfig: function (config) {
    var projectsDir = this.getProjectsConfigDir(config)
    var projectsConfigFiles = this.getProjectConfigFiles(projectsDir)
    var configs = []

    for (var configFile of projectsConfigFiles) {
      var projectConfig = this.getProjectConfig(configFile)
      projectConfig['identifier'] = this.getProjectIdentifier(projectConfig);
      configs[this.getProjectIdentifier(projectConfig)] = projectConfig;
    }

    return configs
  },

  getProjectsConfigDir: function (config) {
    return __dirname + '/../../' + config.projectsDir
  },

  getProjectConfigFiles: function (projectsDir) {
    var filter = '.yml'
    var projectFiles = []

    if (!fs.existsSync(projectsDir)) {
      throw new Error("Projects directory don't exist " + projectsDir)
    }

    var files = fs.readdirSync(projectsDir)
    for (var i = 0; i < files.length; i++) {
      var filename = path.join(projectsDir, files[i])
      var stat = fs.lstatSync(filename)
      if (stat.isDirectory()) {
        fromDir(filename, filter)
      } else if (filename.indexOf(filter) === (filename.length-4)) {
        projectFiles.push(filename)
      }
    }

    return projectFiles
  },

  getProjectConfig: function (configFile) {
    return yaml.safeLoad(fs.readFileSync(configFile, 'utf8'))
  },

  getProjectIdentifier: function (projectConfig) {
    return projectConfig.name.toLowerCase().replace(/\s/g, '_')
  }
}
