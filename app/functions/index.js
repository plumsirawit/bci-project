const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.sendMessage = functions.https.onRequest((request, response) => {
    const uid = request.query.UID;
    const msg = request.query.message;
    console.log(uid, msg);
    return admin.firestore().collection('bci_users').where('id','==',uid).get()
    .then(snapshot => {
        var did = "";
        snapshot.forEach(doc => {
            did = doc.id;
        });
        if(did != ""){
            return admin.firestore().collection('bci_users').doc(did).collection('chats').add({
                data: msg,
                read: false,
                sender: 'bci',
                timestamp: admin.firestore.FieldValue.serverTimestamp(),
                type: "message"
            });
        }else{
            return false;
        }
    })
    .then(result => {
        if(result === false){
            return response.status(404);
        }else{
            return response.send("OK");
        }
    });
});
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < 10; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

exports.newBCI = functions.https.onRequest((req, res) => {
    return admin.firestore().collection('bci_users').get()
    .then(snapshot => {
        ids = {};
        snapshot.forEach(doc => {
            ids[doc.id] = true;
        });
        var cur = makeid();
        while(cur in ids){
            cur = makeid();
        }
        return cur;
    })
    .then(uid => {
        return admin.firestore().collection('bci_users').add({
            conn: "",
            id: uid,
            name: ""
        });
    })
    .then(result => {
        return result.get();
    })
    .then(gett => {
        return res.send(gett.get('id'));
    });
});

exports.setName = functions.https.onRequest((req,res) => {
    const uid = req.query.UID;
    const name = req.query.name;
    return admin.firestore().collection('bci_users').where('id','==',uid).get()
    .then(snapshot => {
        var did = "";
        snapshot.forEach(x => {
            did = x.id;
        });
        return did;
    })
    .then(did => {
        if(did){
            return admin.firestore().collection('bci_users').doc(did).update({
                name: name
            });
        }else{
            return false;
        }
    })
    .then(result => {
        if(result === false){
            res.status(404);
        }else{
            res.send("OK");
        }
    });
})
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
