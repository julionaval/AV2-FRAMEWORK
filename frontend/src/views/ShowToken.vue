<template>
  <div style="padding:20px;">
    <h1>Token do Usuário</h1>

    <div v-if="loading">Carregando token...</div>

    <div v-else-if="token">
      <p><strong>Copie o token abaixo:</strong></p>
      <textarea style="width:100%;height:200px;" readonly>{{ token }}</textarea>
    </div>

    <div v-else>
      <p>Nenhum usuário logado.</p>
      <p>Vá para <router-link to="/login">Login</router-link> e entre com Google, depois volte aqui.</p>
    </div>
  </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default {
  data() {
    return {
      token: "",
      loading: true
    };
  },
  mounted() {
    const auth = getAuth();
    // aguarda até que o Firebase reporte o estado do usuário
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          this.token = await user.getIdToken(true); // força token novo
        } catch (e) {
          this.token = "Erro ao obter token: " + (e && e.message ? e.message : e);
        }
      } else {
        this.token = "";
      }
      this.loading = false;
      unsub();
    });
  }
};
</script>
