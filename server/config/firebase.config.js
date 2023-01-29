
const admin = require("firebase-admin");
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://musicweb-62d49-default-rtdb.firebaseio.com"
});

module.exports = admin;