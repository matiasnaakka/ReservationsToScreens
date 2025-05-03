import * as dotenv from 'dotenv';
import admin from 'firebase-admin';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';

dotenv.config();

const serviceAccount = {
  type: "service_account",
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

initializeAdminApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
});

const db = admin.firestore();
const auth = admin.auth();

const verifyFirebaseToken = async (idToken) => {
  try {
    return await auth.verifyIdToken(idToken);
  } catch (error) {
    throw new Error('Invalid Firebase ID token');
  }
};

export { db, auth, verifyFirebaseToken, admin };
