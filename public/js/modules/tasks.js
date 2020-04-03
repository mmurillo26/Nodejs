import axios from "axios";
import Swal from "sweetalert2";
import {updateProgress} from '../functions/progress'

const tasks = document.querySelector('.listado-pendientes');

if(tasks) {
    tasks.addEventListener('click', e => {
      if(e.target.classList.contains('fa-check-circle')) {

        const icon = e.target;
        const idTask = icon.parentElement.parentElement.dataset.tarea;


        const url = `${location.origin}/tasks/${idTask}`;


        axios.patch(url, {idTask})
          .then(function(respuesta){
            if(respuesta.status === 200) {
              icon.classList.toggle('completo');

              updateProgress();
            }
          })
          .catch(error => {
            console.log(error);
          });
      }

      if(e.target.classList.contains('fa-trash')) {
        const taskHTML = e.target.parentElement.parentElement;
        const taskId = taskHTML.dataset.tarea;

        Swal.fire({
          title: 'Are you sure?',
          text: "You won't be able to revert this!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
          if (result.value) {
            // eliminar tarea
            const url = `${location.origin}/tasks/${idTask}`;
            const icon = e.target;
            const idTask = icon.parentElement.parentElement.dataset.tarea;
            axios.delete(url, {params: {idTask}})
            .then(function(respuesta) {
              if(respuesta.status === 200) {
                console.log(respuesta);
                // delete nodo
                taskHTML.parentElement.removeChild(taskHTML);
                // alert
                Swal.fire(
                  'Deleted Task',
                  respuesta.data,
                  'success'
                )
                updateProgress();
              }
            });
          }
        })
      }
    });
}

export default tasks;
