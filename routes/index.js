const express = require('express');
const router = express.Router();

// importar express validator
const { body } = require('express-validator/check');

// importar controlador
const controller = require('../controllers/controller');
const taskController = require('../controllers/taskController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

module.exports = function() {
  // ruta home
  router.get('/',
    authController.userAuthenticated, 
    controller.homeProject
  );
  router.get('/new-project', 
  authController.userAuthenticated,
    controller.projectForm
  );
  router.post('/new-project',
    body('nombre').not().isEmpty().trim().escape(),
      authController.userAuthenticated,
      controller.newProject
    );

  // ruta proyectos url
  router.get('/projects/:url',
    authController.userAuthenticated,
    controller.urlProject
  );
  // editar proyecto
  router.get('/projects/edit/:id',
    authController.userAuthenticated,
    controller.editForm
  );
  router.post('/new-project/:id',
    body('nombre').not().isEmpty().trim().escape(),
      authController.userAuthenticated,
      controller.updateProject
    );
  // eliminar proyecto
  router.delete('/projects/:url',
    authController.userAuthenticated,
    controller.deleteProject
  );
  // tarea
  router.post('/projects/:url',
    authController.userAuthenticated,
    taskController.addTask
  );
  // actualizar
  router.patch('/tasks/:id',
    authController.userAuthenticated,
    taskController.changeStateTask
    );
  // eliminar
  router.delete('/tasks/:id',
    authController.userAuthenticated,
    taskController.deleteTask
  );
  // Crear cuenta
  router.get('/create-account', userController.formCreateAccount);
  router.post('/create-account', userController.createAccount);
  // login
  router.get('/login', userController.formLogin);
  // autenticar
  router.post('/login', authController.authenticateUser);
  // logout
  router.get('/logout', authController.logout);
  // restablecer password
  router.get('/restore', userController.restoreFormPassword);
  router.post('/restore', authController.sendToken);
  router.get('/restore/:token', authController.resetPassword);
  router.post('/restore/:token', authController.updatePassword);
  return router;
}
