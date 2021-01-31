/**
 *    Server side Express
 *
 *    Ejecutarlo con nodemon para actualizar cambios automaticamente
 *    node ./node_modules/nodemon/bin/nodemon.js express/server.js
 */

"use strict";
// servidor express
const express = require("express");
const servidor = express();
const compression = require("compression");
// puerto del express
const _port = 4100;
const _dominio = "programacionremota.danielcastelao.org";
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
var spawnSync = require('child_process').spawnSync;
let _code = ''; // respuesta del comando

var admin = require("firebase-admin");
/**
 * Utilizamos la service account para entornos de servidores
 * https://console.cloud.google.com/iam-admin/serviceaccounts/details/112294775774598014073?authuser=0&project=programacionremota
 */
var serviceAccount = require("./programacionremota-9f71ccbf2365.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://programacionremota.firebaseio.com"
});

// Get a database reference
var db = admin.database();
// ruta de los servers
var refServers = db.ref("servers");
var refWorkbenchs = db.ref("workbenchs");
var refUsers = db.ref("users");

// Rutas
// ---- SOLICITUD DE PUESTA EN MARCHA DE UN BANCO DE TRABAJO ---- //
// req.query.banconombre
servidor.get("/solicitud", cors(corsOptions), async (req, res) => {
  const result = await levantarNodeRED(req.query.bancoid, req.query.banconombre, req.query.uid, req.query.user, req.query.avatar);
  res.send("{\"code\":" + result + "}");
});

// ---- SOLICITUD DE CIERRE DUN BANCO DE TRABAJO ---- //
servidor.get("/cierre/:id", cors(corsOptions), async (req, res) => {
  const result = await stopNodeRED(req.params.id);
  res.send("{\"code\":" + result + "}");
});

// escucha del servidor
servidor.listen(_port, "0.0.0.0", () => {
  console.log("Servidor corriendo " + _port)
});

/**
 * Ejecuta comandos para levantar instancia de node-RED
 * @param bancoID banco de trabajo, instancia de node-RED
 * @param bancoNombre nombre del banco de trabajo
 * @param uid del usuario que solicita
 * @email del usuario
 * @avatar del usuario
 */
function levantarNodeRED(bancoID, bancoNombre, uid, email, avatar) {
  console.log("Start " + bancoID + " de " + email);

  /* actualiza datos en firebase */
  refWorkbenchs.child(bancoID).update(
    {
        userLogueado: email,
        avatar: avatar,
        status: 'busy'
    }
  );
  refUsers.child(uid).update(
    {
      'banco': bancoID,
      'bancoNombre': bancoNombre
    }
  )

  /* comando para ejecutar node-red con pm2
   * pm2 start script
   * --watch restar on file change
   * --name nombre de la aplicacion
   * -- argumentos para node-red
   * -s setting de node-red
   * -p port
   * -u user dir (utilizamos email del usuario)
   * -
   */
  // script
  let pm2_start = '';
  // puerto
  let argsNodeRED = ' -p ' + bancoID.substr(2, bancoID.length);
  // user home
  let userName = email.substr(0, email.indexOf('@'));
  argsNodeRED = argsNodeRED + ' -u ' + _homeNodesRED + '/' + bancoID + '/users/' + userName;
  // fichero setting, contiene ruta de otros nodes y otros parametros
  argsNodeRED = argsNodeRED + ' -s ' + _homeNodesRED + '/' + bancoID + '/settings.js';
  // nodo inicial
  // argsNodeRED = argsNodeRED + ' flow' + bancoID + '.json';
  console.log(argsNodeRED);
  pm2_start = 'pm2 start node-red --watch --name ' + bancoID + ' -- ' + argsNodeRED;
  return ejecutarComando(pm2_start);
}

/**
 * Ejecuta comandos para parar instancia de node-RED
 * @param bancoID banco de trabajo, instancia de node-RED
 */
function stopNodeRED(bancoID){
  // comando a ejecutar
  let pm2_stop = 'pm2 delete ' + bancoID;
  console.log("Delete " + bancoID);
  return ejecutarComando(pm2_stop);

}

/**
 * ejecuto comando
 * @param comando python a ejecutar
 */
function ejecutarComando(comando) {
  let options = {shell: true};
  const ret = spawnSync(comando, null, options);
  console.log(ret.output.toString());
  return ret.status;
}
