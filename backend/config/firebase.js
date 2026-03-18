const admin = require('firebase-admin');

let app;
if (!admin.apps.length) {
  try {
    // Try environment variable first (for Vercel deployment)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ''
      });
    } else {
      // Fallback to local file (for local development)
      const path = require('path');
      const serviceAccount = require(path.join(__dirname, 'serviceAccountKey.json'));
      app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET || ''
      });
    }
  } catch (err) {
    console.error('Firebase init error:', err.message);
    process.exit(1);
  }
} else {
  app = admin.app();
}

const db = admin.firestore();
const bucket = admin.storage().bucket();
const auth = admin.auth();

module.exports = { admin, db, bucket, auth };
