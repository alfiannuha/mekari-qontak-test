import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  // ...
  apiKey: "AIzaSyDdDCpI1ShoHdMaD61XwHUzDt_Xz_pgoUo",
  authDomain: "test-mekari-qontak.firebaseapp.com",
  projectId: "test-mekari-qontak",
  storageBucket: "test-mekari-qontak.firebasestorage.app",
  messagingSenderId: "230588472867",
  appId: "1:230588472867:web:3b3bd5fa282d7899039b96",
  databaseURL: "https://test-mekari-qontak-default-rtdb.firebaseio.com/",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// Initialize Realtime Database and get a reference to the service
const database = getDatabase(app);

export default database