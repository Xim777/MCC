const admin = require('firebase-admin');

let db, bucket, auth;
let initError = null;

if (!admin.apps.length) {
  try {
    let serviceAccount;
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    } else {
      const path = require('path');
      serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
    }
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ''
    });
  } catch (err) {
    initError = err.message;
    console.error('Firebase init error:', err.message);
  }
}

if (admin.apps.length) {
  db = admin.firestore();
  bucket = admin.storage().bucket();
  auth = admin.auth();
}

module.exports = { admin, db, bucket, auth, initError };
