// src/main.js — versão final, sem debug e com auth sincronizada

import { createPinia, setActivePinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

// Firebase
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from './stores/auth';

// -----------------------------------------------------
// 🔥 Config do Firebase (a mesma que você já tinha)
// -----------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyBcbE8kQAiNbC3oPRC9-oHIFP4cFhEJBMk",
  authDomain: "projeto-taref.firebaseapp.com",
  projectId: "projeto-taref",
  storageBucket: "projeto-taref.firebasestorage.app",
  messagingSenderId: "569974046916",
  appId: "1:569974046916:web:d46ca408729dc3368a8991",
  measurementId: "G-ZJWHHL0XPV"
};

initializeApp(firebaseConfig);

// -----------------------------------------------------
// 🧠 Cria app + Pinia antes, e só monta após onAuthStateChanged
// -----------------------------------------------------
const pinia = createPinia();
setActivePinia(pinia); // permite usar useAuthStore fora de componentes

const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vuetify);

const auth = getAuth();
const authStore = useAuthStore();

let appMontado = false;

onAuthStateChanged(auth, async (user) => {
  try {
    await authStore.setUser(user); // aqui ele pega e grava o idToken

    if (!appMontado) {
      app.mount('#app');
      appMontado = true;
      console.log('App montado após onAuthStateChanged. User?', !!user);
    }
  } catch (err) {
    console.error('Erro ao setar usuário no authStore:', err);
    if (!appMontado) {
      app.mount('#app');
      appMontado = true;
    }
  }
});
