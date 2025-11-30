// main.js - VERSÃO DEBUG (monta imediatamente para evitar tela branca)
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from './router';

// Firebase (modular)
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from './stores/auth';

// --- COLE AQUI SUA CONFIG DO FIREBASE (substitua os valores) ---
const firebaseConfig = {
  apiKey: "AIzaSyBcbE8kQAiNbC3oPRC9-oHIFP4cFhEJBMk",
  authDomain: "projeto-taref.firebaseapp.com",
  projectId: "projeto-taref",
  storageBucket: "projeto-taref.firebasestorage.app",
  messagingSenderId: "569974046916",
  appId: "1:569974046916:web:d46ca408729dc3368a8991",
  measurementId: "G-ZJWHHL0XPV"
};


// ---------------------------------------------------------------

initializeApp(firebaseConfig);

const pinia = createPinia();
const app = createApp(App);
app.use(pinia);
app.use(router);
app.use(vuetify);

// --- DEBUG: monta imediatamente (evita tela branca) ---
const auth = getAuth();
const authStore = useAuthStore();

// monta imediatamente (apenas para debug)
app.mount('#app');
console.log('DEBUG: app montado imediatamente (modo debug)');

// ainda escuta mudanças de autenticação para atualizar o store
onAuthStateChanged(auth, async (user) => {
  try {
    await authStore.setUser(user);
    console.log('DEBUG: onAuthStateChanged -> user?', !!user);
  } catch (err) {
    console.error('DEBUG: erro ao setUser', err);
  }
});


