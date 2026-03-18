const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// Place your serviceAccountKey.json in /backend/config/
const serviceAccountPath = path.join(__dirname, 'serviceAccountKey.json');

let app;
try {
  const serviceAccount = require(serviceAccountPath);
  app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ''
  });
} catch (err) {
  console.error('Firebase init error. Make sure config/serviceAccountKey.json exists.');
  console.error('Download it from Firebase Console > Project Settings > Service Accounts');
  process.exit(1);
}

const db = admin.firestore();
const bucket = admin.storage().bucket();
const auth = admin.auth();

module.exports = { admin, db, bucket, auth };
