<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card>
          <v-card-title class="text-h6">Entrar</v-card-title>
          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="onSubmit">
              <v-text-field
                v-model="email"
                label="E-mail"
                type="email"
                :rules="emailRules"
                required
              />
              <v-text-field
                v-model="password"
                label="Senha"
                type="password"
                :rules="passwordRules"
                required
              />

              <v-row class="mt-4" justify="space-between">
                <v-btn :disabled="loading" color="primary" @click="onSubmit">
                  {{ mode === 'login' ? 'Entrar' : 'Criar conta' }}
                </v-btn>

                <v-btn text @click="toggleMode">
                  {{ mode === 'login' ? 'Criar conta' : 'Já tenho conta' }}
                </v-btn>
              </v-row>

              <v-alert v-if="error" type="error" class="mt-3">
                {{ errorMessage }}
              </v-alert>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import api from '@/services/api'
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth'

export default {
  name: 'Login',
  setup() {
    const authStore = useAuthStore()
    const email = ref('')
    const password = ref('')
    const mode = ref('login') // 'login' | 'signup'
    const loading = ref(false)
    const error = ref(null)
    const valid = ref(false)
    const form = ref(null)

    const emailRules = [
      v => !!v || 'E-mail é obrigatório',
      v => /.+@.+\..+/.test(v) || 'E-mail inválido'
    ]
    const passwordRules = [
      v => !!v || 'Senha é obrigatória',
      v => v.length >= 6 || 'Senha mínima 6 caracteres'
    ]

    const errorMessage = computed(() => {
      if (!error.value) return ''
      if (typeof error.value === 'string') return error.value
      if (error.value?.message) return error.value.message
      if (error.value?.error) return error.value.error
      return JSON.stringify(error.value)
    })

    async function onSubmit() {
      error.value = null
      loading.value = true

      try {
        const firebaseAuth = getAuth()
        let userCredential = null

        if (mode.value === 'login') {
          userCredential = await signInWithEmailAndPassword(firebaseAuth, email.value, password.value)
        } else {
          userCredential = await createUserWithEmailAndPassword(firebaseAuth, email.value, password.value)
        }

        const user = userCredential.user
        // obtém idToken do Firebase client
        const idToken = await user.getIdToken()

        // chama o backend para criar cookie HttpOnly e obter user
        await authStore.login(idToken)

        // navegar para dashboard
        window.location.href = '/dashboard' // ou usar router push, simples e seguro
      } catch (err) {
        console.error('login error', err)
        error.value = err?.response?.data || err
      } finally {
        loading.value = false
      }
    }

    function toggleMode() {
      mode.value = mode.value === 'login' ? 'signup' : 'login'
      error.value = null
    }

    return {
      email,
      password,
      mode,
      loading,
      error,
      valid,
      form,
      emailRules,
      passwordRules,
      onSubmit,
      toggleMode,
      errorMessage
    }
  }
}
</script>

<style scoped>
.fill-height {
  min-height: calc(100vh - 64px);
}
</style>
