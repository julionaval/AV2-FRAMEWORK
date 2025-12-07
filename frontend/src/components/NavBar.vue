<template>
  <v-app-bar app color="primary" dark>
    <v-toolbar-title style="cursor:pointer" @click="$router.push('/')">Gerenciador</v-toolbar-title>
    <v-spacer />
    <div v-if="user">
      <v-btn text @click="$router.push('/tarefas')">Tarefas</v-btn>
      <v-menu offset-y>
        <template #activator="{ props }">
          <v-btn v-bind="props" icon>
            <v-avatar size="32">
              <img v-if="user.photoURL" :src="user.photoURL" />
              <v-icon v-else>mdi-account</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>{{ user.displayName || user.email }}</v-list-item-title>
          </v-list-item>
          <v-divider />
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </div>
  </v-app-bar>
</template>

<script>
import { useAuthStore } from '@/stores/auth';
export default {
  name: 'NavBar',
  setup () {
    const store = useAuthStore();
    const logout = async () => {
      await store.logout();
      // redireciona para login
      window.location.href = '/login';
    };
    return { user: store.user, logout };
  }
};
</script>

<style scoped>
v-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
