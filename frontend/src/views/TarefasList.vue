<template>
  <v-container>
    <NavBar />

    <v-row class="my-6">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <span class="text-h6">Minhas Tarefas</span>
            <v-spacer />
            <v-btn color="primary" @click="$router.push('/tarefas/nova')">
              Nova Tarefa
            </v-btn>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-list>
              <template v-if="tarefas.length">
                <v-list-item
                  v-for="t in tarefas"
                  :key="t.id"
                >
                  <v-list-item-title
                    :style="{ textDecoration: t.status === 'concluida' ? 'line-through' : 'none' }"
                  >
                    {{ t.titulo }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    Prioridade: <strong>{{ t.prioridade }}</strong> •
                    Status: <strong>{{ t.status }}</strong> •
                    Criada em: {{ formatDate(t.data_criacao) }}
                    <span v-if="t.data_limite">
                      • Prazo: {{ formatDate(t.data_limite) }}
                    </span>
                  </v-list-item-subtitle>

                  <!-- Ações à direita (substitui v-list-item-action) -->
                  <template #append>
                    <v-btn icon @click="toggleConcluida(t)">
                      <v-icon>
                        {{ t.status === 'concluida' ? 'mdi-undo' : 'mdi-check' }}
                      </v-icon>
                    </v-btn>

                    <v-btn icon @click="$router.push(`/tarefas/${t.id}`)">
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn>

                    <v-btn icon color="red" @click="remover(t.id)">
                      <v-icon>mdi-delete</v-icon>
                    </v-btn>
                  </template>
                </v-list-item>
              </template>

              <p v-else class="text-center mt-6">
                Nenhuma tarefa cadastrada.
              </p>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <Carousel />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import NavBar from '@/components/NavBar.vue';
import Carousel from '@/components/Carousel.vue';
import { ref, onMounted } from 'vue';
import { apiClient } from '@/services/api';

export default {
  name: 'TarefasList',
  components: { NavBar, Carousel },

  setup() {
    const tarefas = ref([]);

    const carregar = async () => {
      try {
        const api = apiClient();
        const res = await api.get('/tarefas');
        tarefas.value = res.data;
      } catch (err) {
        console.error('Erro ao carregar tarefas', err);
        alert('Erro ao carregar tarefas.');
      }
    };

    const toggleConcluida = async (t) => {
      try {
        const novoStatus = t.status === 'concluida' ? 'pendente' : 'concluida';
        const api = apiClient();
        const res = await api.put(`/tarefas/${t.id}`, {
          ...t,
          status: novoStatus,
          titulo: t.titulo // obrigatório
        });
        const idx = tarefas.value.findIndex((x) => x.id === t.id);
        if (idx !== -1) tarefas.value[idx] = res.data;
      } catch (err) {
        console.error(err);
        alert('Erro ao alterar status.');
      }
    };

    const remover = async (id) => {
      if (!confirm('Tem certeza que deseja excluir?')) return;
      try {
        const api = apiClient();
        await api.delete(`/tarefas/${id}`);
        tarefas.value = tarefas.value.filter((x) => x.id !== id);
      } catch (err) {
        console.error(err);
        alert('Erro ao excluir tarefa.');
      }
    };

    const formatDate = (isoString) => {
      if (!isoString) return '';
      return new Date(isoString).toLocaleString();
    };

    onMounted(carregar);

    return { tarefas, carregar, toggleConcluida, remover, formatDate };
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.mt-6 {
  margin-top: 1.5rem;
}
</style>
