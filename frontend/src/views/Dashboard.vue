<template>
  <v-container>
    <NavBar />

    <v-row class="mt-6" justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-4">
          <h2 class="text-h5 mb-4">Bem-vindo ao Gerenciador de Tarefas</h2>

          <p>Use o menu acima para acessar suas tarefas.</p>

          <v-btn color="primary" @click="$router.push('/tarefas')">
            Ver minhas tarefas
          </v-btn>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
export default {
  name: 'Dashboard',
  components: { NavBar }
};
</script>
