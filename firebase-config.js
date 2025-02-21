// Importa Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyA3B_GzzQziXK_DSKepTgbo17a_17QOhR4",
  authDomain: "clientes-em-espera.firebaseapp.com",
  projectId: "clientes-em-espera",
  storageBucket: "clientes-em-espera.firebasestorage.app",
  messagingSenderId: "322688784105",
  appId: "1:322688784105:web:4cb8a86481c0ff2313c278",
  measurementId: "G-MVK8JPGX82",
};

const app = initializeApp(firebaseConfig);
const bancoDeDados = getFirestore(app);

export { bancoDeDados };
