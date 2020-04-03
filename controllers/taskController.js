const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.addTask = async (req, res, next) => {
  const project = await Projects.findOne({where: {url: req.params.url}});

  // leer el valor del input
  const {tarea} = req.body;
  // estado 0 = incompleto y ID de proyecto
  const estado = 0;
  const proyectoId = project.id;

  // insertar en la base de datos
  const result = await Tasks.create({tarea, estado, proyectoId});

  if(!result){
    return next();
  }
  // redireccionar
  res.redirect(`/projects/${req.params.url}`);
}

exports.changeStateTask = async (req, res, next) => {
  const {id} = req.params;
  const tarea = await Tasks.findOne({where: {id}});
  console.log(id);
  // cambiar estado
  let estado = 0;
  if(tarea.estado === estado){
    estado = 1;
  }
  tarea.estado = estado;
  const result = await tarea.save();
  if(!result) return next();

  res.send('Actualizado');
  // console.log({id});
}

exports.deleteTask = async (req, res, next) => {
  const {id} = req.params;
  console.log(id);
  // const resultado = await Tasks.destroy({where: {id}});
  
  // if(!resultado) return next();

  res.status(200).send('Deleted Task...');
}
