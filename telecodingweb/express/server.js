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
const _dominio = "192.168.1.43";
const _homeNodesRED = '/home/pi/ProgramacionRemota/node-red';

// usamos cors para permitir peticiones desde el angular
var cors = require('cors');
servidor.use(cors());
var corsOptions = {
  origin: 'http://' + _dominio + ':4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

// comprimir encabezados
servidor.use(compression());

// modulo child_process para ejecutar comandos del sistema
var exec = require('child_process').exec;

// Rutas
// ---- SOLICITUD DE PUESTA EN MARCHA DE UN BANCO DE TRABAJO ---- //
servidor.get("/solicitud/:id", cors(corsOptions), (req, res) => {
  levantarNodeRED(req.params.id);
  res.send("{\"Listo\":1}");
});

// ---- SOLICITUD DE CIERRE DUN BANCO DE TRABAJO ---- //
servidor.get("/cierre/:id", cors(corsOptions), (req, res) => {
  stopNodeRED(req.params.id);
  res.send("{\"Listo\":0}");
});

// escucha del servidor
servidor.listen(_port, "0.0.0.0", () => {
  console.log("Servidor corriendo " + _port)
});

/**
 * Ejecuta comandos para levantar instancia de node-RED
 * @param bancoID banco de trabajo, instancia de node-RED
 */
function levantarNodeRED(bancoID) {
  console.log("Start " + bancoID);

  /* comando para ejecutar node-red con pm2
   * pm2 start script
   * --watch restar on file change
   * --name nombre de la aplicacion
   * -- argumentos para node-red
   * -s setting de node-red
   * -p port
   * -u user dir
   */
  let pm2_start = '';
  let argsNodeRED = ' -p ' + bancoID.substr(2, bancoID.length);
  argsNodeRED = argsNodeRED + ' -u ' + _homeNodesRED + '/' + bancoID;
  argsNodeRED = argsNodeRED + ' flow' + bancoID + '.json';
  console.log(argsNodeRED);
  pm2_start = 'pm2 start node-red --watch --name ' + bancoID + ' -- ' + argsNodeRED;
  ejecutarComando(pm2_start);
}

/**
 * Ejecuta comandos para parar instancia de node-RED
 * @param bancoID banco de trabajo, instancia de node-RED
 */
function stopNodeRED(bancoID){
  console.log("Delete " + bancoID);
  // comando a ejecutar
  let pm2_stop;
  pm2_stop = 'pm2 delete ' + bancoID;
  ejecutarComando(pm2_stop);
}


/**
 * ejecuto comando
 * @param comando python a ejecutar
 */
function ejecutarComando(comando) {
  const child = exec(comando);
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
