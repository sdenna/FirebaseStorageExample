import firebase from 'firebase/compat/app'
import 'firebase/compat/storage'

import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6h9PkXnZ8zDzXZ-6dMnNg5a_36jfEufA",
  authDomain: "imagestoragern.firebaseapp.com",
  projectId: "imagestoragern",
  storageBucket: "imagestoragern.appspot.com",
  messagingSenderId: "925895347774",
  appId: "1:925895347774:web:0235f8c4b624fce5de8b6f"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

const app = initializeApp(firebaseConfig);
export {app, firebase}