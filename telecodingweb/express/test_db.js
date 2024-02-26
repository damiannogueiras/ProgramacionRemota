// Import the functions you need from the SDKs you need
const initializeApp = require("firebase/app");

const admin= require('firebase-admin');

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = require("./environments/firebase_conf.json");

// Initialize Firebase
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

