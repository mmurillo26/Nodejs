import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.querySelector('#eliminar-proyecto');
if(btnDelete) {
  btnDelete.addEventListener('click', e => {
    const urlProject = e.target.dataset.projectUrl;

    // console.log(urlProject);
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
        // enviar peticion a axios
        const url = `${location.origin}/projects/${urlProject}`;
        axios.delete(url, { params: {urlProject}})
          .then(function(respuesta) {
            console.log(respuesta);
            Swal.fire(
              'Deleted!',
              respuesta.data,
              'success'
            );
          
            setTimeout(() => {
              window.location.href = '/'
            },2000)
          })
          .catch(() => {
            Swal.fire({
              type: 'error',
              title: 'An error has occurred',
              text: 'The project could not deleted'
            });
          });
      }
    })
  });
}

export default btnDelete;
