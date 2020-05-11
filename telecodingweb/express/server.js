/**
 *    Server side Express
 *
 *    Ejecutarlo con nodemon para actualizar cambios automaticamente
 *    node ./node_modules/nodemon/bin/nodemon.js express/app.js
 */

"use strict";
// servidor express
const express = require("express");
const servidor = express();
const compression = require("compression");
// puerto del express
const _port = 4100;
// usamos cors para permitir peticiones desde el angular
var cors = require('cors');
servidor.use(cors());
var corsOptions = {
  origin: 'http://telecoding.duckdns.org:4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// comprimir encabezados
//servidor.use(compression());



// Rutas
// ---- SOLICITUD DE PUESTA EN MARCHA DE UN BANCO DE TRABAJO ---- //
servidor.get("/solicitud/:id", cors(corsOptions), (req, res) => {
  levantarNodeRED(req.params.id);
  //res.send("Listo");
  res.sendStatus(200);
});

// ---- SOLICITUD DE CIERRE DUN BANCO DE TRABAJO ---- //
servidor.get("/cierre/:id", cors(corsOptions), (req, res) => {
  deleteNodeRED(req.params.id);
  //res.send("Listo");
  res.sendStatus(200);
});


/* No termina de funcionar para el dominio externo
 * si para la ip local
// ---- SERVE ANGULAR APP ---- //
// directorio para servir la app de angular
const _angular_folder = 'dist/telecodingweb';
servidor.all('/', function (req, res) {
  res.status(200).sendFile(`/`, {root: _angular_folder});
});
*/


// escucha del servidor
servidor.listen(_port, "0.0.0.0", () => {
  console.log("Servidor corriendo")
});

/**
 * Ejecuta comandos para levantar instancia de node-RED
 * @param id banco de trabajo, instancia de node-RED
 */
function levantarNodeRED(id) {
  console.log("Levantando " + id);
  // modulo child_process para ejecutar comandos del sistema
  var exec = require('child_process').exec;

  // 'pm2', ['start /home/pi/ProgramacionRemota/pm2/ecosystem.config.js'
  // comando a ejecutar
  let comando_pm2;
  comando_pm2 = 'pm2 start /home/pi/ProgramacionRemota/pm2/ecosystem.config.js --only ' + id;
  const child = exec(comando_pm2);
  // Pasamos los parámetros error, stdout la salida del comando
  child.stdout.on('data', (data) => {
    console.log('stdout: ' + data);
  });

  child.stderr.on('data', (data) => {
    console.error('stderr: ' + data);
  });

  child.on('close', (code) => {
    console.log('child process exited with code ' + code);
  });
}

function deleteNodeRED(id){
  console.log("Delete " + id);
  // modulo child_process para ejecutar comandos del sistema
  var exec = require('child_process').exec;

  // 'pm2', ['start /home/pi/ProgramacionRemota/pm2/ecosystem.config.js'
  // comando a ejecutar
  let comando_pm2;
  comando_pm2 = 'pm2 stop /home/pi/ProgramacionRemota/pm2/ecosystem.config.js --only ' + id;
  const child = exec(comando_pm2);
  // Pasamos los parámetros error, stdout la salida del comando
  child.stdout.on('data', (data) => {
    console.log('stdout: ' + data);
  });

  child.stderr.on('data', (data) => {
    console.error('stderr: ' + data);
  });

  child.on('close', (code) => {
    console.log('child process exited with code ' + code);
  });
}
