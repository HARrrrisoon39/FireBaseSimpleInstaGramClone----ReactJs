import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyCkZ8AnSPnUWVXkjmu9n3U8C5K4p6KAy2c",
  authDomain: "insta-c785a.firebaseapp.com",
  databaseURL: "https://insta-c785a.firebaseio.com",
  projectId: "insta-c785a",
  storageBucket: "insta-c785a.appspot.com",
  messagingSenderId: "964406757280",
  appId: "1:964406757280:web:b49d54e1a45acb512946c5",
  measurementId: "G-ST3DWLK1EB",
});
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
