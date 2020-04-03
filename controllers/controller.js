const Projects = require('../models/Projects');
const db = require('../config/db');
const Tasks = require('../models/Tasks');


exports.homeProject = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll( {where: {userId}});
  res.render('index', {
    nombrePagina: 'Proyectos',
    projects
  });
}

exports.projectForm = async (req, res) => {
  const userId = res.locals.user.id;
  const projects = await Projects.findAll( {where: {userId}});
  res.render('newProject', {
    nombrePagina: 'Nuevo Proyecto',
    projects
  });
}

exports.newProject = async (req, res) => { // async (req, res) => {
  // enviar a la consola
  const userId = res.locals.user.id;
  const projects = await Projects.findAll( {where: {userId}});

  // validar que hay algo en el input
  const { nombre } = req.body;

  let errores = [];

  if(!nombre) {
    errores.push({'texto': 'Agrega un nombre al proyecto'});
  }

  // si hay errores
  if(errores.length > 0){
    res.render('newProject', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      projects
    });
  } else{
    // si no hay errores
    // guardar en la BD
      const userId = res.locals.user.id;
      await Projects.create({ nombre, userId })
      .catch(error => console.log(error));
      res.redirect('/');
  }

}

exports.urlProject = async (req, res, next) => {
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll( {where: {userId}});
  const projectPromise = Projects.findOne({
    where: {
      url: req.params.url,
      userId
    }
  });
  const [projects, project] = await Promise.all([projectsPromise,projectPromise]);

  const tasks = await Tasks.findAll({
    where: {proyectoId: project.id}
  });

  if(!project) return next();

  res.render('tareas', {
    nombrePagina: 'Tareas del Proyecto',
    project,
    projects,
    tasks
  });

}

exports.editForm = async (req, res) => {
  const userId = res.locals.user.id;
  const projectsPromise = Projects.findAll( {where: {userId}});
  const projectPromise = Projects.findOne({
    where: {
      id: req.params.id,
      userId
    }
  });

  const [projects, project] = await Promise.all([projectsPromise,projectPromise]);
  // render a la vista
  res.render('newProject', {
    nombrePagina: 'Editar Proyecto',
    projects,
    project
  });
}

exports.updateProject = async (req, res) => { // async (req, res) => {
  // enviar a la consola
  const userId = res.locals.user.id;
  const projects = await Projects.findAll( {where: {userId}});

  // validar que hay algo en el input
  const { nombre } = req.body;

  let errores = [];

  if(!nombre) {
    errores.push({'texto': 'Agrega un nombre al proyecto'});
  }

  // si hay errores
  if(errores.length > 0){
    res.render('newProject', {
      nombrePagina: 'Nuevo Proyecto',
      errores,
      projects
    });
  } else{
    // si no hay errores
    // guardar en la BD
      await Projects.update(
        { nombre },
        {where: {id: req.params.id}}
      );
      res.redirect('/');
  }

}

exports.deleteProject = async (req, res, next) => {
  // req, params o query
  // console.log(req.query);

  const {urlProject} = req.query;
  const results = await Projects.destroy({where: {url: urlProject}});
  if(!results) {
    return next();
  }
  res.send('Your project has been deleted.');
}
