// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCxKuCVSGraNlNHpDe1DT3yc7f0_QUxOH4",
    authDomain: "mycryptoproj.firebaseapp.com",
    databaseURL: "https://mycryptoproj-default-rtdb.firebaseio.com",
    projectId: "mycryptoproj",
    storageBucket: "mycryptoproj.appspot.com",
    messagingSenderId: "270643395444",
    appId: "1:270643395444:web:ee5fa42770e71988a70a21"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
