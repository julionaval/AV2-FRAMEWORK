import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import Dashboard from '../views/Dashboard.vue';
import Login from '../views/Login.vue';
import TarefaForm from '../views/TarefaForm.vue';
import TarefasList from '../views/TarefasList.vue';

const routes = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/tarefas', name: 'Tarefas', component: TarefasList, meta: { requiresAuth: true } },
  { path: '/tarefas/nova', name: 'TarefaNova', component: TarefaForm, meta: { requiresAuth: true } },
  { path: '/tarefas/:id', name: 'TarefaEdit', component: TarefaForm, meta: { requiresAuth: true } },

  // ⭐ ROTA DO TOKEN (correta)
  { path: '/token', name: 'TokenPage', component: () => import('../views/ShowToken.vue') }
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

// Proteção de rotas
let firstCheck = false;

router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  const requiresAuth = to.meta.requiresAuth;
  const auth = getAuth();

  // aguarda firebase verificar usuário na primeira carga
  if (!firstCheck) {
    await new Promise((resolve) => {
      const unsub = onAuthStateChanged(auth, async (user) => {
        await authStore.setUser(user);
        unsub();
        resolve();
      });
    });
    firstCheck = true;
  }

  if (requiresAuth && !authStore.user) return next('/login');
  if (to.name === 'Login' && authStore.user) return next('/');

  next();
});

export default router;
