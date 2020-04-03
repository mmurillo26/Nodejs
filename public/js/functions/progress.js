export const updateProgress = () => {
  // seleccionar las tareas existentes
   const tasks = document.querySelectorAll('li.tarea');

   if(tasks.length) {
     // seleccionar las tareas completadas
     const doneTask = document.querySelectorAll('i.completo');

     // calcular el avance
     const progress = Math.round((doneTask.length / tasks.length) * 100);

     // mostrar el avance
     const percent = document.querySelector('#percent');
     percent.style.width = progress+'%';
   }
}
