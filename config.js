const firebase = require("firebase")
const firebaseConfig = {
  apiKey: "AIzaSyDOw2l_TKxIb4fFNgvYMuKuAxxKl4sqllY",
  authDomain: "zoomchatbot-545fd.firebaseapp.com",
  projectId: "zoomchatbot-545fd",
  storageBucket: "zoomchatbot-545fd.appspot.com",
  messagingSenderId: "1044416090896",
  appId: "1:1044416090896:web:94286ac095f8c28c6d0b95",
  measurementId: "G-94H6HW9XNC"
};
  firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const User = db.collection("Users");
  module.exports = User;