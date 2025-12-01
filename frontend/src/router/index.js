// frontend/src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'

import Dashboard from '../views/Dashboard.vue'
import Login from '../views/Login.vue'
import TarefaForm from '../views/TarefaForm.vue'
import TarefasList from '../views/TarefasList.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', name: 'Login', component: Login, meta: { requiresAuth: false } },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/tarefas', name: 'Tarefas', component: TarefasList, meta: { requiresAuth: true } },
  { path: '/tarefas/nova', name: 'TarefaNova', component: TarefaForm, meta: { requiresAuth: true } },
  { path: '/tarefas/:id', name: 'TarefaEdit', component: TarefaForm, meta: { requiresAuth: true }, props: true },
  { path: '/:pathMatch(.*)*', redirect: '/login' }, // fallback
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// Global guard: usa apenas o authStore (que consulta o backend /api/auth/me)
router.beforeEach(async (to) => {
  const auth = useAuthStore()

  // Se ainda não carregamos o usuário, tente buscar do backend (uma vez)
  if (!auth.user && !auth.loading) {
    try {
      await auth.fetchMe()
    } catch {
      // ignorar erro — auth.user ficará null
    }
  }

  // Se a rota exige auth e não tiver usuário, redireciona para login
  if (to.meta?.requiresAuth && !auth.isAuthenticated) {
    return { name: 'Login' }
  }

  // Se estiver logado e tentando acessar login, manda para dashboard
  if (to.name === 'Login' && auth.isAuthenticated) {
    return { name: 'Dashboard' }
  }

  return true
})

export default router
