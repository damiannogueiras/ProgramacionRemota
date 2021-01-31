/**
 * Utilizamos la service account para entornos de servidores
 * https://console.cloud.google.com/iam-admin/serviceaccounts/details/112294775774598014073?authuser=0&project=programacionremota
 */
var admin = require("firebase-admin");
var serviceAccount = require("../environments/programacionremota-9f71ccbf2365.json");
var servidores;// = require("../interfaces/server.js");
var wbs = require("../interfaces/wbs.js");
var users = require("../interfaces/users.js");

// inicializamos la base de datos
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://programacionremota.firebaseio.com"
});

// Get a database reference
var db = admin.database();
// ruta de los servers
var refServers = db.ref("servers");
//var AARef = refServers.child("AA");
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
 * @param nuevo
 */
const actualizoNroInst = (serverActual, nuevo) => {
  console.log("Server Actual: " + serverActual);
  refServers.child(serverActual).update({nroInst: nuevo});
}
const getNroInst = (serverActual) => {
  return servidores[serverActual].nroInst;
};
const getMaxInst = (serverActual) => {
  return servidores[serverActual].maxInst;
};

exports.getNroInst = getNroInst;
exports.getMaxInst = getMaxInst;
exports.actualizoNroInst = actualizoNroInst;

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
 * Acceso a users
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

