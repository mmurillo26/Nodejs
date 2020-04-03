const Sequelize = require('sequelize');
const db = require('../config/db');
const Projects = require('../models/Projects')

const Tasks = db.define('tareas', {
  id : {
    type: Sequelize.INTEGER(11),
    primaryKey: true,
    autoIncrement: true
  },
  tarea: Sequelize.STRING,
  estado: Sequelize.INTEGER(1)
});

Tasks.belongsTo(Projects);

module.exports = Tasks;
