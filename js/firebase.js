
import { initializeApp }
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc }
    from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAsBlDaVI4yeqAnnD51OEc2-XD1Q6kf_RQ",
    authDomain: "zelda-2ec12.firebaseapp.com",
    projectId: "zelda-2ec12",
    storageBucket: "zelda-2ec12.firebasestorage.app",
    messagingSenderId: "505239814627",
    appId: "1:505239814627:web:265eacd50323021877e0d6",
    measurementId: "G-MSK28NG1F6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

