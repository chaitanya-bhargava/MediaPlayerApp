// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5HTyXdtoLSCPIjwMMsqnxybVG1sFLIB8",
  authDomain: "mediaplayer-94ca2.firebaseapp.com",
  projectId: "mediaplayer-94ca2",
  storageBucket: "mediaplayer-94ca2.appspot.com",
  messagingSenderId: "471225334990",
  appId: "1:471225334990:web:18361423160d35ed7d649f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);