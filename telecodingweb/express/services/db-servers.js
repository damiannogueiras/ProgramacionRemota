/**
 * Utilizamos la service account para entornos de servidores
 * https://firebase.google.com/docs/database/admin/start?hl=es#node.js_2
 */
var admin = require("firebase-admin");
var serviceAccount = require("../environments/service_account.json");

// Configuracion de firebase con autenticacion de service account
// https://console.cloud.google.com/iam-admin/serviceaccounts/details/112294775774598014073/keys?hl=es&project=programacionremota&supportedpurview=project
const firebaseConfig = {
  databaseURL: "https://programacionremota.firebaseio.com",
  credential: admin.credential.cert(serviceAccount)
};

admin.initializeApp(firebaseConfig);

// Get a database reference
var db = admin.database();
// ruta de los servers
var refServers = db.ref("servers");
// ruta a los wbs
var refWbs = db.ref("workbenchs");
// ruta a los users
var refUsers = db.ref("users");
// ruta a los avatares
var refAvatares = db.ref("servers/AA/avatares");


// Attach an asynchronous callback to read the data at our posts reference
refServers.on("value", function(snapshot) {
  servidores = snapshot.val();
  //console.log(servidores);

}, function (errorObject) {
  console.log("La lectura servidores realtime fallo: " + errorObject.code);
});
// Attach an asynchronous callback to read the data at our posts reference
refAvatares.on("value", function(snapshot) {
  avatares = snapshot.val();
  // console.log(avatares);

}, function (errorObject) {
  console.log("La lectura servidores realtime fallo: " + errorObject.code);
});
// Actualizacion de los puertos libres
refServers.child("AA").child("portsWBNode").on("value", function(snapshot) {
  portsWBNode = snapshot.val();
  console.log(portsWBNode);
}, function (errorObject) {
  console.log("La lectura servidores realtime fallo: " + errorObject.code);
});
refWbs.on("value", function(snapshot) {
  wbs = snapshot.val();
  //console.log(wbs);
}, function (errorObject) {
  console.log("La lectura servidores realtime fallo: " + errorObject.code);
});
refUsers.on("value", function(snapshot) {
  users = snapshot.val();
  //console.log(snapshot.val());
  //console.log(users);
}, function (errorObject) {
  console.log("La lectura servidores realtime fallo: " + errorObject.code);
});

/**
 * Acceso a servidores
 * @param nuevo formato json de lo que queremos actualizar
 */
const actualizoServer = (serverActual, nuevo) => {
  // console.log("Actualizo Server Actual: " + serverActual.toString());
  // console.log("con " + nuevo.toString());
  refServers.child(serverActual).update(nuevo);
}
exports.actualizoServer = actualizoServer;

/**
 * Devuelve el nro instancias actuales y el maximo
 * @param serverActual
 * @return {*}
 */
const getNroInst = (serverActual) => {
  return servidores[serverActual].nroInst;
};
exports.getNroInst = getNroInst;
const getMaxInst = (serverActual) => {
  return servidores[serverActual].maxInst;
};
exports.getMaxInst = getMaxInst;

/**
 * Actualiza WB
 */
const actualizarWB = (bancoID, email, userUIDLogueado, avatar) => {
  refWbs.child(bancoID).update(
    {
      userLogueado: email,
      userUIDLogueado: userUIDLogueado,
      avatar: avatar,
      t_remaining: 120,
      t_total: 120
    }
  );
};
exports.actualizarWB = actualizarWB;

/**
 * Actualiza status WB
 */
const actualizarStatusWB = (bancoID, status) => {
  refWbs.child(bancoID).update(
    {
      status: status
    }
  );
};
exports.actualizarStatusWB = actualizarStatusWB;

/**
 * crear a WB
 * TODO copiar de una plantilla, por ej del AA2000
 */
const crearWB = (bancoID, uid, email, avatar, status) => {
  refWbs.child(bancoID).update(
    {
      UD: 'https://nodered.org/docs/tutorials/first-flow',
      avatar: avatar,
      components: 'node-red',
      userLogueado: email,
      descr: '<p>Ocupado</p>',
      show: false,
      nombre: 'Node-RED',
      pass: 1234,
      photo: 'https://firebasestorage.googleapis.com/v0/b/programacionremota.appspot.com/o/imagenes%2FAA00.png?alt=media&token=6242714d-6649-4470-8ba5-11f1aa620497',
      status: status,
      t_remaining: 120,
      t_total: 120,
      userUIDLogueado: uid,
      userNodeRED: 'yoda',
    }
  );
};
exports.crearWB = crearWB;

/**
 * para saber si el WB es un banco nodeRED only
 */
const isNodeRED = (bancoID) => {
  return(wbs[bancoID].nombre == "Node-RED");
}
exports.isNodeRED = isNodeRED;
/**
 * Borrar WB
 */
const borrarWB = (bancoID) => {
  console.log("Borro " + bancoID);
  refWbs.child(bancoID).remove();
}
exports.borrarWB = borrarWB;

/**
 * Actualizo datos del user
 */
const actualizarUser = (uid, bancoID, bancoNombre) => {
  refUsers.child(uid).update(
    {
      'banco': bancoID,
      'bancoNombre': bancoNombre
    }
  );
};
exports.actualizarUser = actualizarUser;

/**
 * Busca el primer puerto libre que es el primer cero que encuentre
 * @return indice del primer puerto libre
 */
const getPrimeroLibre = () => {
  console.log("Primero libre:" + portsWBNode.indexOf(0));
  return portsWBNode.indexOf(0);
}
exports.getPrimeroLibre = getPrimeroLibre;

/**
 * rellena con 1/0 el puerto levantado
 */
const setPuerto = (serverActual, puerto, value) => {
  console.log("Puerto a 1: " + puerto);
  let indice = puerto - 2000;
  portsWBNode[indice] = value;
  refServers.child(serverActual).child("portsWBNode").set(portsWBNode);
  console.log("Puertos: " + portsWBNode);
}
exports.setPuerto = setPuerto;

/**
 * obtiene el banco que ocupa un usuario
 * @param UID del usuario
 * @return banco ucupado
 */
const getWBbyUID = (UID) => {
  return users[UID].banco;
}
exports.getWBbyUID = getWBbyUID;

/**
 * obtiene el UID del usuario segun el banco
 * @param banco
 * @return UID usuario
 */
const getUIDbyWB = (bancoID) => {
  return wbs[bancoID].userUIDLogueado;
}
exports.getUIDbyWB = getUIDbyWB;

/**
 * obtiene avatar random
 * @return URL avatar
 */
const getAvatarRand = () => {
  // Math.random() * 59 pasamos a entero el random
  return avatares[Math.round(Math.random() * 59)];
}
exports.getAvatarRand = getAvatarRand;

