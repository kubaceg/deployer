var express = require('express')
var app = express()
var bodyParser = require('body-parser')
const yaml = require('js-yaml')
const fs = require('fs')
const config = yaml.safeLoad(fs.readFileSync('config/deployer.yml', 'utf8'))
const projects = require('./modules/projects.js')
const execute = require('./modules/execute.js')
const slack = require('./modules/slack.js')
const stateDb = require('./modules/stateDb.js')
const projectsConfig = projects.getProjectsConfig(config)

stateDb.initialize(projectsConfig)

app.set('view engine', 'ejs')
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', function (req, res) {
  res.render('pages/index', {
    config: config,
    projects: projectsConfig
  })
})

app.get('/project/:projectIdentifier', function (req, res) {
  var project = projectsConfig[req.params.projectIdentifier]
  project.lastDeploy = stateDb.getCurrentProjectState(req.params.projectIdentifier)

  res.render('pages/project', {
    config: config,
    project: project
  })
})

app.get('/deploy/:projectIdentifier', function (req, res) {
  var projectIdentifier = req.params.projectIdentifier
  var project = projectsConfig[projectIdentifier]

  stateDb.runProjectDeploy(projectIdentifier, project.name)
  async function exec() {
    try {
      await execute.executeProjectCommands(project)
      stateDb.changeProjectState(projectIdentifier, 'success', result)
      slack.sendNotification('Project ' + project.name + ' deployed succesfully!', config);
    } catch (err) {
      stateDb.changeProjectState(projectIdentifier, 'error', err.toString())
      slack.sendNotification('Project ' + project.name + ' deploy error!', config);
    }
  }

  exec()

  res.send('OK')
})

const server = app.listen(config.port, () => {
  console.log(
    `Express running → ${server.address().address}:${server.address().port}`
  )
})
