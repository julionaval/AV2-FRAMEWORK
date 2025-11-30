<template>
  <div style="padding: 20px;">
    <h1>Token do Usuário</h1>

    <div v-if="loading">
      Carregando token...
    </div>

    <div v-else-if="token">
      <p><strong>Copie o token abaixo:</strong></p>
      <textarea style="width:100%;height:200px;">{{ token }}</textarea>
    </div>

    <div v-else>
      Nenhum usuário logado.
    </div>
  </div>
</template>

<script>
import { getAuth } from "firebase/auth";

export default {
  data() {
    return {
      token: "",
      loading: true
    };
  },
  async mounted() {
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        this.token = await user.getIdToken(true);
      }
    } catch (e) {
      this.token = "Erro ao pegar token: " + e.message;
    } finally {
      this.loading = false;
    }
  }
};
</script>
