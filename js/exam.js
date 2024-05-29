$(function(){

  console.log($);
}); // Fin de la función anónima que sirve como punto de entrada de jQuery


window.addEventListener("load", function(){
  console.log("Inicio");

  // Creamos un objeto URL para la base de la API de Star Wars
  const baseUrl = new URL('http://localhost/exam/php/getEmployee.php');
  // Agregamos el endpoint para obtener la lista de películas
  const filmsEndpoint = 'films/'; // Elegimos elegimos el path de búsqueda para películas.
  // Creamos una nueva URL con el endpoint de películas
  const filmsUrl = new URL(filmsEndpoint, baseUrl);
  filmsUrl.searchParams.set('search', 'Jedi'); // Fijamos parámetros de búsqueda
  console.log(baseUrl.toString()); // https://swapi.dev/api/films/?search=Jedi

  fetch('./php/getEmployee.php') // Hacer una solicitud GET a la API con la ruta de la película "A New Hope"
  .then(response => response.json()) // Analizar la respuesta JSON
  .then(data => {    
    let results = data.results; // Obtenemos el array de búsqueda  
    console.log(data); // 1. Solamente un único resultado obtenido
  })
  .catch(error => console.error(error)); // Manejar errores    
})

/**
 * El DOM está dividido en 2 partes, por un lado un formulario sobre el cual
 * se recoge una serie de datos de un empleado y por otro disponemos de una tabla
 * dónde mostrar los datos recogidos.
 * Los datos que se solicitan son: Nombre, Apellido, Edad, Puesto de trabajo y Localización
 * Por cada empleado deberemos crear una fila en la tabla con dichos datos, el botón create, en lugar
 * de enviar los datos al servidor se limita a recogerlos y mostrarlos en la tabla utilizando
 * el API de DOM O jQuery. pero sin utilizar la propiedad innerHTML. El botón debe capturar
 * el evento submit y cancelar su envio al servidor.  Una vez recogidos los datos se debe resetear
 * el formulario.  Los datos deben ser validados antes de ser mostrados en la tabla.
 */

window.addEventListener("load", function () { // Esperar a que la página cargue completamente
  console.log("Inicio");



  // --- Manejo del formulario y tabla ---

  const createButton = document.getElementById('create');
  const resultsTableBody = document.querySelector('#results tbody');
  const selectedEmployeeTextarea = document.getElementById('selected-employee');

  createButton.addEventListener('click', function () {
    if (!validateForm()) return;

    const fullName = document.getElementById('validationDefault01').value + ' ' +
                     document.getElementById('validationDefault02').value;
    const age = document.getElementById('validationDefault03').value;
    const jobtitle = document.getElementById('validationDefault04').value;
    const location = document.getElementById('validationDefault05').value;

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
      <td>${fullName}</td>
      <td>${age}</td>
      <td>${jobtitle}</td>
      <td>${location}</td>
    `;
    resultsTableBody.appendChild(newRow);
  });

  function validateForm() {
    let isValid = true;
    document.querySelectorAll('input[required]').forEach(input => {
      if (input.value === '') {
        input.classList.add('is-invalid');
        isValid = false;
      } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
      }
    });
    return isValid;
  }

  resultsTableBody.addEventListener('click', function (event) {
    const clickedRow = event.target.closest('tr'); // Encontrar la fila clicada

    // Deseleccionar otras filas y seleccionar la clicada
    resultsTableBody.querySelectorAll('tr').forEach(row => row.classList.remove('selected'));
    clickedRow.classList.add('selected');

    // Obtener datos de la fila y mostrar en textarea
    const employeeData = {
      fullName: clickedRow.cells[0].textContent,
      age: clickedRow.cells[1].textContent,
      jobtitle: clickedRow.cells[2].textContent,
      location: clickedRow.cells[3].textContent
    };
    selectedEmployeeTextarea.value = JSON.stringify(employeeData, null, 2); // Convertir a JSON con formato el null es para que no haya espacios y el 2 es para que haya 2 espacios
  });

  document.getElementById('random').addEventListener('click', function() {
    fetch('../php/getEmployee.php') // Hacer una solicitud GET a la API con la ruta de la película "A New Hope"
    .then(response => response.json()) // Analizar la respuesta JSON
    .then(employee=>{
      document.getElementById('validationDefault01').value = employee.firstname;
      document.getElementById('validationDefault02').value = employee.lastname;
      document.getElementById('validationDefault03').value = employee.age;
      document.getElementById('validationDefault04').value = employee.jobtitle;
      document.getElementById('validationDefault05').value = employee.location;
    })
    .catch(error => console.error('Error al obtener el empleado aleatorio',error)); // Manejar errores
  });

  document.getElementById('send').addEventListener('click', function() {
    // Obtener la fila seleccionada
    const selectedRow = document.querySelector('#results tbody tr.selected');

    if (!selectedRow) {
        alert("Por favor selecciona un empleado");
        return;
    }

    // Obtener los datos del empleado
    const fullName = selectedRow.cells[0].textContent;
    const [firstname, lastname = ''] = fullName.split(' '); // Asegura que lastname tenga un valor
    const age = selectedRow.cells[1].textContent;
    const jobtitle = selectedRow.cells[2].textContent;
    const location = selectedRow.cells[3].textContent;

    // Crear un objeto FormData para enviar los datos
    const formData = new FormData();
    formData.append('firstname', firstname);
    formData.append('lastname', lastname);
    formData.append('age', age);
    formData.append('jobtitle', jobtitle);
    formData.append('location', location);

    // Enviar la solicitud al servidor PHP
    fetch('../php/saveEmployee.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) { // Si la respuesta no es exitosa
            throw new Error('Error en la solicitud: ' + response.statusText);
        }
        return response.text(); // Asumimos que el servidor devuelve JSON
    })
    .then(data => {
        console.log(data); // Manejar la respuesta del servidor
        alert("Empleado guardado con éxito"); // Notificar al usuario
    })
    .catch(error => {
        console.error('Error al guardar el empleado:', error);
        alert('Error al guardar el empleado: ' + error.message); // Mostrar un mensaje de error amigable al usuario
    });
});
    
}); // Fin de la función anónima que sirve como punto de entrada de JavaScript