const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('var/db.json')
const db = low(adapter)

db.defaults({projects: []}).write()

module.exports = {
    initialize: function(projectsConfig) {
        for(projectId in projectsConfig) {
            if(!db.get('projects').find({id: projectId}).value()) {
                db.get('projects').push({id: projectId}).write()
            }
        }
    },

    runProjectDeploy: function (projectId, projectName) {
        var dateTime = new Date().toISOString()
        db.get('projects')
        .find({id: projectId})
        .assign({status:'pending',date: dateTime, name: projectName, log:''})
        .write()
    },

    changeProjectState: function (projectId, newState, log) {
        db.get('projects')
        .find({id: projectId})
        .assign({status:newState, log:log})
        .write()
    },

    getCurrentProjectState: function(projectId) {
        return db.get('projects')
            .find({id: projectId})
            .value()
    }
}