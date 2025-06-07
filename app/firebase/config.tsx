import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCjFFFhlFlI380U6uVugcjpT-KR49uN6bU",
  authDomain: "listagemprinter.firebaseapp.com",
  projectId: "listagemprinter",
  storageBucket: "listagemprinter.firebasestorage.app",
  messagingSenderId: "362518936463",
  appId: "1:362518936463:web:dc1763f78fc7d1899129fa",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

export { auth };
