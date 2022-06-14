<?php
//1.- conectamos a la base de datos
$conexion = mysqli_connect('localhost', 'root', '', 'sistete');

//1.1 Revisar la conexion
if(!$conexion) {
    die("Error al conectarse: ". mysqli_connect_error());
}
?>