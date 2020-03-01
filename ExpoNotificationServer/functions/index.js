const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const Request = require('request-promise');
const app = express();
app.use(cors({ origin: true }));

const serviceAccount = require('./serviceAccountKey.json');
const collectionName = 'ExponentPushTokens';

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://exponotificationserver.firebaseio.com"
});

const db = admin.firestore();

const options = {
    method: 'POST',
    uri: 'https://exp.host/--/api/v2/push/send',
    headers: {
        "host": "exp.host",
        "accept": "application/json",
        "accept-encoding": "gzip, deflate",
        "content-type": "application/json"
    },
    json: true
};

app.get('/', (request, response) => {
    return response.send('Exponent Push Notifications API V1.0.0');
});

app.get('/showExponentPushTokens', (request, response) => {
    let getCollection = [];
    return db.collection(collectionName).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                getCollection.push(Object.assign({ id: doc.id }, doc.data()));
            });
        }).then(() => {
            return response.send(getCollection);
        })
        .catch((err) => {
            return console.log('Error getting documents', err);
        });
});

app.post('/saveExponentPushToken', (request, response) => {
    let res = db.collection(collectionName).doc(request.body.user.id).set({
        ExponentPushToken: request.body.token.value,
        User: request.body.user
    });
    return response.send(res);
});

app.post('/pushNotification', (request, response) => {
    let localOptions = options;
    localOptions.body = {
        to: request.body.pushToken,
        title: request.body.title,
        body: request.body.body,
        data: {
            title: request.body.title,
            body: request.body.body
        }
    };
    return Request(localOptions)
        .then((parsedBody) => {
            return response.send(JSON.stringify(parsedBody));
        })
        .catch((err) => {
            console.log(err);
            return response.send(err);
        });
});

app.post('/broadcastNotification', (request, response) => {
    let ExponentPushTokens = [];
    let messages = [];
    let localOptions = options;
    return db.collection(collectionName).get()
        .then((snapshot) => {
            snapshot.forEach((doc) => {
                ExponentPushTokens.push(doc.data().ExponentPushToken);
            });
        }).then(() => {
            for (var key in ExponentPushTokens) {
                const message = {
                    title: request.body.title,
                    body: request.body.body,
                    data: {
                        title: request.body.title,
                        body: request.body.body
                    }
                };
                message.to = ExponentPushTokens[key];
                messages.push(message);
            }
            localOptions.body = messages;
            return Request(localOptions)
                .then((parsedBody) => {
                    return response.send(JSON.stringify(parsedBody));
                })
                .catch((err) => {
                    console.log(err);
                    return response.send(err);
                });
        })
        .catch((err) => {
            return console.log('Error getting documents', err);
        });
});

app.delete('/', (request, response) => {
    let res = deleteCollection(db, collectionName, 32);
    return response.send(res);
});

function deleteCollection(db, collectionPath, batchSize) {
    let collectionRef = db.collection(collectionPath);
    let query = collectionRef.orderBy('__name__').limit(batchSize);
    return new Promise((resolve, reject) => {
        deleteQueryBatch(db, query, batchSize, resolve, reject);
    });
}

function deleteQueryBatch(db, query, batchSize, resolve, reject) {
    query.get()
        .then((snapshot) => {
            if (snapshot.size == 0) {
                return 0;
            }
            let batch = db.batch();
            snapshot.docs.forEach((doc) => {
                batch.delete(doc.ref);
            });
            return batch.commit().then(() => {
                return snapshot.size;
            });
        }).then((numDeleted) => {
            if (numDeleted === 0) {
                resolve();
                return;
            }
            process.nextTick(() => {
                deleteQueryBatch(db, query, batchSize, resolve, reject);
            });
        })
        .catch(reject);
}

exports.ExponentPushNotifications = functions.region('asia-east2').runWith({ memory: '2GB' }).https.onRequest(app);