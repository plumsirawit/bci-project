const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendMessage = functions.https.onRequest((request, response) => {
    const uid = request.query.UID;
    const msg = request.query.message;
    console.log(uid, msg);
    return admin.firestore().collection('bci_users').where('id','==',uid).get().then(snapshot => {
        var did = "";
        snapshot.forEach(doc => {
            did = doc.id;
        });
        if(did == ""){
            return response.status(404);
        }
        return admin.firestore().collection('bci_users').doc(did).collection('chats').add({
            data: msg,
            read: false,
            sender: 'bci',
            timestamp: admin.firestore.FieldValue.serverTimestamp(),
            type: "message"
        }).then(() => response.send("OK"));
    });
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
