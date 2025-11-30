<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6">
        <v-card class="pa-6">
          <v-card-title class="text-h5">Login</v-card-title>
          <v-card-text>
            <v-btn block color="primary" @click="loginGoogle">
              Entrar com Google
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useAuthStore } from '@/stores/auth';

export default {
  name: 'Login',
  setup() {
    const store = useAuthStore();

    const loginGoogle = async () => {
      try {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        await store.setUser(result.user);
        window.location.href = '/';
      } catch (err) {
        console.error('Erro no login:', err);
        alert('Falha no login: ' + err.message);
      }
    };

    return { loginGoogle };
  }
};
</script>
