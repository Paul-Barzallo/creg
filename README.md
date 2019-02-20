# Correos Recibidos y Enviados de Gmail

Con esta aplicación se puede saber cuantos correos se han recibido y enviado desde una fecha a otra de cuenta en concreto o todas  si se deja en blanco el campo correo.
Tambien se puede obtener un grafico que lo muestra

## Prerrequisitos

No es necesario tener dada instalado pero si tienes un servidor mejor

## Instalacion

necesita un servidor para ejecutar, si no tienes uno se puede probar con un servidor local

### Ejemplo con python:
```
python -m http.server
```
abre por defecto en el puerto 8000, si puede añadir **:xxx** donde las x es el puerto

como se usa la API de GMAIl se necesita credenciales para ejecutar la aplicación, por defecto están las mías pero si se quiere cambiar para administrarlo desde otro usuario de google se puede, esto es necesario para ejecutarlo en un servidor que no sea el localhost ya que se necesita permisos de **Orígenes de JavaScript autorizados** para ejecutar y solo tengo autorizado a localhost:8000 y localhost:8080
para administrar la API se necesita crear un proyecto en https://console.developers.google.com, generar unas credenciales y luego solo se cambia el clientId por el propio en la primera linea del archivo **/js/apiGmail.js**
```JavaScript
var CLIENT_ID = credencial;
```

## Creado con

* API Gmail
* JavaScript
* CSS
* Bootstrap
* JQuery
* Moment.js
* Google Charts
