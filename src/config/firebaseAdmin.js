const admin = require('firebase-admin');
const path = require('path');

// IMPORTANT: Replace 'YOUR_SERVICE_ACCOUNT_KEY_FILENAME.json'
// with the actual name of your service account key file.
const serviceAccountPath = path.join(__dirname, 'firebase-service-account.json');

let firebaseAdminInitialized = false;

const initializeFirebaseAdmin = () => {
  if (!firebaseAdminInitialized) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountPath),
    });
    firebaseAdminInitialized = true;
    console.log('Firebase Admin SDK initialized successfully.');
  }
};

module.exports = { initializeFirebaseAdmin, admin };