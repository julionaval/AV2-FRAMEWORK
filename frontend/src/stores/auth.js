// frontend/src/stores/auth.js
import { defineStore } from 'pinia'
import api from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
  },

  actions: {
    async fetchMe() {
      this.loading = true
      try {
        const res = await api.get('/auth/me')
        this.user = res.data
        this.error = null
      } catch (err) {
        this.user = null
      } finally {
        this.loading = false
      }
    },

    async login(idToken) {
      this.loading = true
      try {
        const res = await api.post('/auth/login', { idToken })
        this.user = res.data.user
        this.error = null
        return res.data.user
      } catch (err) {
        this.error = err?.response?.data || 'Erro no login'
        throw err
      } finally {
        this.loading = false
      }
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } finally {
        this.user = null
      }
    }
  }
})
