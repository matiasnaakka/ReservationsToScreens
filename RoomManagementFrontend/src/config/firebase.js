/**
 * @fileoverview Firebase configuration and initialization with analytics
 * @module firebase/config
 */

import { initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Validate environment


/**
 * Firebase configuration object
 * @type {import('firebase/app').FirebaseOptions}
 */
const firebaseConfig = {
  apiKey: "AIzaSyDkVYa6uI46PwO43FWaxB8aQJSetsQ8D4g",
  authDomain: "infoscreenmanager.firebaseapp.com",
  projectId: "infoscreenmanager",
  storageBucket: "infoscreenmanager.firebasestorage.app",
  messagingSenderId: "724947825606",
  appId: "1:724947825606:web:8e121e42553dc59ec638c7",
  measurementId: "G-J1RX8RXM0P"
};

// Initialize Firebase with error handling
let app;
let analytics = null;
let auth;
let db;

/**
 * Initializes Firebase services
 * @throws {Error} If initialization fails
 */
const initializeFirebase = () => {
  if (!firebaseConfig.apiKey || !firebaseConfig.authDomain) {
    throw new Error('Invalid Firebase configuration');
  }

  try {
    // Initialize core Firebase app if not already initialized
    if (!app) {
      app = initializeApp(firebaseConfig);
    }

    // Initialize Auth with the app instance
    auth = getAuth(app);
    if (!auth) {
      throw new Error('Failed to initialize Firebase Auth');
    }

    // Initialize Firestore
    db = getFirestore(app);

    return true;
  } catch (error) {
    console.error('Firebase initialization error:', error);
    throw new Error(`Failed to initialize Firebase: ${error.message}`);
  }
};

// Initialize Firebase services immediately
initializeFirebase();

try {
  // Initialize analytics only if supported
  isSupported().then(supported => {
    if (supported) {
      analytics = getAnalytics(app);
    } else {
      console.warn('Firebase Analytics is not supported in this environment');
    }
  }).catch(error => {
    console.error('Error checking analytics support:', error);
  });
} catch (error) {
  console.error('Error initializing Firebase:', error);
  throw new Error('Failed to initialize Firebase services');
}

/**
 * Register a new user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<import('firebase/auth').UserCredential>} - Firebase user credential
 * @throws {Error} - Registration error
 */
const registerUser = async (email, password) => {
  if (!auth) {
    await initializeFirebase();
  }

  if (!email?.trim() || !password?.trim()) {
    throw new Error('Email and password are required');
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Registration error details:', error);

    // Map Firebase error codes to user-friendly messages
    const errorMessages = {
      'auth/email-already-in-use': 'Email is already registered',
      'auth/invalid-email': 'Invalid email format',
      'auth/operation-not-allowed': 'Email/password accounts are not enabled',
      'auth/weak-password': 'Password is too weak',
      'auth/configuration-not-found': 'Firebase configuration is invalid',
    };

    throw new Error(errorMessages[error.code] || error.message || 'Registration failed');
  }
};

/**
 * Login a user with email and password
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<import('firebase/auth').UserCredential>} - Firebase user credential
 * @throws {Error} - Login error
 */
const loginUser = async (email, password) => {
  if (typeof email !== 'string' || typeof password !== 'string') {
    throw new Error('Invalid input types for email or password');
  }

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    console.error('Error logging in user:', error);
    throw new Error('Failed to login user');
  }
};

/**
 * Export initialized Firebase instances
 * @exports {Object} firebase - Firebase instance and services
 */
export {
  app,
  analytics,
  auth,
  db,
  firebaseConfig,
  registerUser,
  loginUser,
  initializeFirebase // Export for testing purposes
};
