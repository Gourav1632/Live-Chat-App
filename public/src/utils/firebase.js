import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAELPNPrOZmvgzcB8yajmhX0cCtzqLASrE",
    authDomain: "ember--chat-app.firebaseapp.com",
    projectId: "ember--chat-app",
    storageBucket: "ember--chat-app.appspot.com",
    messagingSenderId: "357854922418",
    appId: "1:357854922418:web:488e071eb4c5e06bbe6bab",
    measurementId: "G-V7Q3XG2YY6"
  };
  
  const app = initializeApp(firebaseConfig);
  const imgDB = getStorage(app);

  export {imgDB};
  