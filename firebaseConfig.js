// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB_Dx86dch2j37l7K_UJz121nUya9FAL7M",
  authDomain: "conforme-obra.firebaseapp.com",
  projectId: "conforme-obra",
  storageBucket: "conforme-obra.firebasestorage.app",
  messagingSenderId: "454648875233",
  appId: "1:454648875233:web:32d0f86168af824806cfa0",
  measurementId: "G-8CVWRQW75D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
