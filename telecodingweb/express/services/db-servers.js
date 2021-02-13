/**
 * Utilizamos la service account para entornos de servidores
 * https://console.cloud.google.com/iam-admin/serviceaccounts/details/112294775774598014073?authuser=0&project=programacionremota
 */
var admin = require("firebase-admin");
var serviceAccount = require("../environments/programacionremota-9f71ccbf2365.json");

// inicializamos la base de datos
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://programacionremota.firebaseio.com"
});

// Get a database reference
var db = admin.database();
// ruta de los servers
var refServers = db.ref("servers");
// ruta a los wbs
var refWbs = db.ref("workbenchs");
// ruta a los users
var refUsers = db.ref("users");


// Attach an asynchronous callback to read the data at our posts reference
refServers.on("value", function(snapshot) {
  servidores = snapshot.val();
  //console.log(servidores);

}, function (errorObject) {
  console.log("La lectura servidores realtime fallo: " + errorObject.code);
});
// Actualizacion de los puertos libres
refServers.child("AA").child("portsWBNode").on("value", function(snapshot) {
  portsWBNode = snapshot.val();
  //console.log(portsWBNode);
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
  console.log("Actualizo Server Actual: " + serverActual.toString());
  console.log("con " + nuevo.toString());
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
 * Acceso a WB
 */
const actualizarWB = (bancoID, email, avatar, status) => {
  refWbs.child(bancoID).update(
    {
      userLogueado: email,
      avatar: avatar,
      status: 'busy'
    }
  );
};
exports.actualizarWB = actualizarWB;

/**
 * crear a WB
 * TODO copiar de una plantilla, por ej del AA2000
 */
const crearWB = (bancoID, email, avatar, status) => {
  refWbs.child(bancoID).update(
    {
      UD: 'https://nodered.org/docs/tutorials/first-flow',
      avatar: avatar,
      components: 'node-red',
      userLogueado: email,
      descr: '<p>Banco nodered ocupado</p>',
      pass: 1234,
      photo: 'https://firebasestorage.googleapis.com/v0/b/programacionremota.appspot.com/o/imagenes%2FAA00.png?alt=media&token=6242714d-6649-4470-8ba5-11f1aa620497',
      status: 'busy',
      t_remaining: 120,
      t_total: 120,
      userLogueado: '',
      userNodeRED: 'yoda',
    }
  );
};
exports.crearWB = crearWB;

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
 * rellena con 1 el puerto levantado
 *
 */
const setPuerto = (serverActual, puerto) => {
  console.log("Puerto a 1: " + puerto);
  let indice = puerto - 2000;
  portsWBNode[indice] = 1;
  //var nuevopuerto = "{" + indice + ": 1}";
  //nuevopuerto = JSON.parse(nuevopuerto);
  //console.log(nuevopuerto);
  refServers.child(serverActual).child("portsWBNode").set(portsWBNode);
  console.log(portsWBNode);
}
exports.setPuerto = setPuerto;
