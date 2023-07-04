import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';

import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA9MX79JepjCPRQFEV2gpM1mUk0C-43AB8",
  authDomain: "interest-calculator-a6837.firebaseapp.com",
  projectId: "interest-calculator-a6837",
  storageBucket: "interest-calculator-a6837.appspot.com",
  messagingSenderId: "591406868274",
  appId: "1:591406868274:web:79ac656212e3197146992b",
  measurementId: "G-XZ52XFYMKD"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
export const db = firebase.firestore();
const analytics = getAnalytics(app);