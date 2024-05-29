<?php

$firstname = $_POST['firstname'];
$lastname = $_POST['lastname'];
$age = $_POST['age'];
$jobtitle = $_POST['jobtitle'];
$location = $_POST['location'];

// Crea un objeto con los datos del empleado
$employeeData = [
    'firstname' => $firstname,
    'lastname' => $lastname,
    'age' => $age,
    'jobtitle' => $jobtitle,
    'location' => $location
];

// Codifica los datos en JSON
$jsonData = json_encode($employeeData);

// Ruta del archivo (verifica si el directorio existe)
$tempDir = '../tmp';
if (!is_dir($tempDir)) {
    mkdir($tempDir, 0755, true); // Crea el directorio si no existe
}
$filename = $tempDir . '/' . $lastname . $firstname . ".json";

// Guarda el archivo JSON
if (file_put_contents($filename, $jsonData) !== false) {
    echo "Empleado: " . $firstname . " " . $lastname . " guardado con éxito";
} else {
    // Manejo de errores en caso de que no se pueda guardar el archivo
    http_response_code(500); // Código de error del servidor
    echo "Error al guardar el empleado."; 
}
?>
