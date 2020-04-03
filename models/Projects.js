const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid');
const db = require('../config/db');

const Projects = db.define('proyectos', {
    id : {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre : {
      type: Sequelize.STRING
    },
    url : {
      type: Sequelize.STRING
    }
}, {
    hooks: {
      beforeCreate(project) {
        const url = slug(project.nombre).toLowerCase();
        project.url = `${url}-${shortid.generate()}`;
      }
    }
});

module.exports = Projects;
