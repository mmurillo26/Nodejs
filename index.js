const express = require('express');
const routes = require('./routes');
const path = require('path');
const chalk = require('chalk');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport')

// importar helpers
const helpers = require('./helpers');

// Crear la conexion a la BD
const db = require('./config/db');

// importar el modelo
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

db.sync()
  .then(() => console.log('Conectado al Servidor'))
  .catch(error => console.log(error));

// crear una app de express
const app = express();

// Cargar los archivos
app.use(express.static('public'));

// habilitar pug
app.set('view engine', 'pug');

// habilitar bodyParser
app.use(bodyParser.urlencoded({extended: true}));

// agregar expres validator
// app.use(expressValidator());

// agregar carpeta de vistas
app.set('views', path.join(__dirname, './views'));

// agregar flash messages
app.use(flash());

//  agregar cookie parser
app.use(cookieParser());

// navegar entre paginas sin volver a logearse
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

// pasar vardump
app.use((req, res, next) => {
  res.locals.vardump = helpers.vardump;
  res.locals.messages = req.flash;
  res.locals.user = {...req.user} || null;
  next();
});

app.use('/', routes());

app.listen(7000);
