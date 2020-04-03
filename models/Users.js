const Sequelize = require('sequelize');
const db = require('../config/db');
const Projects = require('../models/Projects')
const bcrypt = require('bcrypt-nodejs');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail: {
                msg : 'Insert a valid email'
            },
            notEmpty: {
                msg : "The email cannot be empty"
            }
        },
        unique: {
            args: true,
            msg: 'This email already exists'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg : "The password cannot be empty"
            }
        }
    },
    token: Sequelize.STRING,
    expiration: Sequelize.DATE
}, { 
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
    }
});
// metodos personalizados
Users.prototype.verifyPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Users.hasMany(Projects);

module.exports = Users;