// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3S16j1TS5p3aSc369OlmpgmnGGb5gj14",
  authDomain: "pantry-tracker-caf22.firebaseapp.com",
  projectId: "pantry-tracker-caf22",
  storageBucket: "pantry-tracker-caf22.appspot.com",
  messagingSenderId: "358371353328",
  appId: "1:358371353328:web:e6453df08d76751f8dd835",
  measurementId: "G-GR3X7L0GHW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app)

export {firestore}