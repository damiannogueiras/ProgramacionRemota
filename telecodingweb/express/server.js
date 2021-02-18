/**
 *    Server side Express
 *
 *    Ejecutarlo con nodemon para actualizar cambios automaticamente
 *    node ./node_modules/nodemon/bin/nodemon.js express/server.js
 */

"use strict";
// servidor express
const express = require("express");
const servidorExpress = express();
const compression = require("compression");
// puerto del express
const _port = 4100;
// puerto del primer banco de nodered
const _portFirstNode = 2000;
const NODORED_BANCOID = "AA2000";
const _dominio = "programacionremota.danielcastelao.org";
const _homeNodesRED = '/home/pi/ProgramacionRemota/node-red';
// puerto del workbench
var puertoWB = 0;
const PUERTO_OCUPADO = 1;
const PUERTO_LIBRE = 0;
// usamos cors para permitir peticiones desde el angular
var cors = require('cors');
servidorExpress.use(cors());
var corsOptions = {
  origin: 'http://' + _dominio + ':4200',
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
// comprimir encabezados
servidorExpress.use(compression());

// modulo child_process para ejecutar comandos del sistema
var spawnSync = require('child_process').spawnSync;

var db = require("./services/db-servers.js");

// Rutas
// ---- SOLICITUD DE PUESTA EN MARCHA DE UN BANCO DE TRABAJO ---- //
servidorExpress.get("/solicitud", cors(corsOptions), async (req, res) => {
  const result = await levantarNodeRED(req.query.bancoid, req.query.banconombre, req.query.uid, req.query.user, req.query.avatar);
  res.send("{\"code\":" + result + ", \"puerto\":" + puertoWB + " }");
});

// ---- SOLICITUD DE CIERRE DUN BANCO DE TRABAJO ---- //
servidorExpress.get("/cierre", cors(corsOptions), async (req, res) => {
  const result = await stopNodeRED(req.query.uid, req.query.bancoid);
  res.send("{\"code\":" + result + "}");
});

// escucha del servidor
servidorExpress.listen(_port, "0.0.0.0", () => {
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
  let nombreInstancia = "nombreInstancia";
  console.log("Start " + bancoID + " de " + email);
  let serverActual = getServerActual(bancoID);
  // comprobamos que no es un workbench, solo instancia nodered
  if (bancoID == NODORED_BANCOID) {
    console.log("ES AA2000");
    // comprobamos que hay puertos libres
    if (db.getMaxInst(serverActual) > db.getNroInst(serverActual)) {
      // levantar instancia nodered
      // busco puerto libre y le suma el inicial
      // TODO si hay error o no lo encuentra getPrimeroLibre devuelve -1
      puertoWB = db.getPrimeroLibre() + _portFirstNode;
      // sumo uno a las instancias
      let unomas = db.getNroInst(serverActual) + 1;
      let nuevovalor = {nroInst: unomas};
      db.actualizoServer(serverActual, nuevovalor);
      // actualizar el puerto que elijo
      db.setPuerto(serverActual, puertoWB, PUERTO_OCUPADO);
      // actualizo id para crear nuevo workbench en firebase
      let bancoIDnuevo = serverActual + puertoWB;
      nombreInstancia = bancoIDnuevo;
      // creo nuevo WB
      db.crearWB(bancoIDnuevo, email, avatar, "busy");
      db.actualizarUser(uid, bancoIDnuevo, bancoNombre);
      // console.log("levanto nodered");
    } else {
     console.log("tienes que esperar");
    }
  } else {
    console.log("no es AA2000");
    nombreInstancia = bancoID;
    puertoWB = getPuertoBanco(bancoID);
    db.actualizarWB(bancoID, email, avatar, "busy");
    db.actualizarUser(uid, bancoID, bancoNombre);
  }


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
  let argsNodeRED = ' -p ' + puertoWB;
  // user home
  let userName = email.substr(0, email.indexOf('@'));
  argsNodeRED = argsNodeRED + ' -u ' + _homeNodesRED + '/' + bancoID + '/users/' + userName;
  // fichero setting, contiene ruta de otros nodes y otros parametros
  argsNodeRED = argsNodeRED + ' -s ' + _homeNodesRED + '/' + bancoID + '/settings.js';
  // nodo inicial
  // argsNodeRED = argsNodeRED + ' flow' + bancoID + '.json';
  pm2_start = 'pm2 start node-red --name ' + nombreInstancia + ' -- ' + argsNodeRED;
  // console.log(pm2_start);
  return ejecutarComando(pm2_start);
}

/**
 * Ejecuta comandos para parar instancia de node-RED
 * Comprueba que el usuario que solicita es el que está en el banco
 * Actuliza firebase
 *   registro del usuario
 *   registro del workbench
 *   resta uno a las instancias
 *   libera el puerto
 *   borra workbench
 * @param UID key del usuario que solicita el cierre
 * @param bancoID banco de trabajo, instancia de node-RED
 */
function stopNodeRED(UID, bancoID){
  console.log("Delete " + bancoID + " por " + UID);
  // comprobamos que el usuario esta usando el banco
  if(bancoID == db.getWBbyUID(UID) || UID === 'admin'){

    let serverActual = getServerActual(bancoID);
    // comando a ejecutar
    let pm2_stop = 'pm2 delete ' + bancoID;
    // si paramos la instancia actualizamos datos firebase
    if(ejecutarComando(pm2_stop) === 0 || ejecutarComando(pm2_stop) === 1) {
      db.actualizarUser(UID, '-', '-');
      db.actualizarWB(bancoID, '-', db.getAvatarRand(), 'free');
      // resto uno a las instancias
      let unomenos = db.getNroInst(serverActual) - 1;
      let nuevovalor = {nroInst: unomenos};
      db.actualizoServer(serverActual, nuevovalor);
      // si es nodered only
      if (db.isNodeRED(bancoID)) {
        // borro el banco
        db.borrarWB(bancoID);
        // libero puerto
        db.setPuerto(serverActual, getPuertoBanco(bancoID), PUERTO_LIBRE);
      }
    } else return -2;
    return 0;
  } else {
    console.log("No estas en ese banco");
    return -1;
  }

}

/**
 * ejecuto comando
 * @param comando python a ejecutar
 */
function ejecutarComando(comando) {
  let options = {shell: true};
  const ret = spawnSync(comando, null, options);
  console.log("Salida ejecutar comando:" + ret.status);
  return ret.status;
}

/**
 * devuelve el puerto del bancoID
 */
function getPuertoBanco(bancoID) {
  // console.log("El banco es: " + parseInt(bancoID.substr(2,bancoID.length)));
  return parseInt(bancoID.substr(2,bancoID.length));
}

/**
 * devuelve el server actual
 */
function getServerActual(bancoID){
  // dos primeros caracteres es el key del servidor
  return bancoID.substr(0,2);
}
