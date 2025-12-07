<template>
  <v-container>
    <NavBar />

    <v-row class="my-6" justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title>
            <span class="text-h6">
              {{ isEdit ? 'Editar Tarefa' : 'Nova Tarefa' }}
            </span>
          </v-card-title>

          <v-divider />

          <v-card-text>
            <v-form @submit.prevent="salvar" v-model="formValido">
              <v-text-field
                v-model="form.titulo"
                label="Título"
                :rules="[rules.obrigatorio]"
                required
                class="mb-4"
              />

              <v-textarea
                v-model="form.descricao"
                label="Descrição"
                rows="3"
                class="mb-4"
              />

              <v-row>
                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.prioridade"
                    :items="prioridades"
                    label="Prioridade"
                    item-title="label"
                    item-value="value"
                    class="mb-4"
                  />
                </v-col>

                <v-col cols="12" sm="6">
                  <v-select
                    v-model="form.status"
                    :items="statusList"
                    label="Status"
                    item-title="label"
                    item-value="value"
                    class="mb-4"
                  />
                </v-col>
              </v-row>

              <v-text-field
                v-model="form.data_limite"
                label="Data limite"
                type="date"
                class="mb-4"
              />

              <v-row class="mt-4" justify="space-between">
                <v-col cols="12" sm="4">
                  <v-btn
                    block
                    variant="outlined"
                    @click="$router.push('/tarefas')"
                  >
                    Voltar
                  </v-btn>
                </v-col>

                <v-col cols="12" sm="4">
                  <v-btn
                    block
                    color="primary"
                    type="submit"
                    :loading="salvando"
                    :disabled="!formValido || salvando"
                  >
                    {{ isEdit ? 'Salvar alterações' : 'Criar tarefa' }}
                  </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { apiClient } from '@/services/api';
import NavBar from '@/components/NavBar.vue';

export default {
  name: 'TarefaForm',
  components: { NavBar },

  setup() {
    const route = useRoute();
    const router = useRouter();
    const api = apiClient();

    const formValido = ref(false);
    const salvando = ref(false);
    const isEdit = ref(false);

    const form = reactive({
      titulo: '',
      descricao: '',
      prioridade: 'media',
      status: 'pendente',
      data_limite: null
    });

    const prioridades = [
      { label: 'Baixa', value: 'baixa' },
      { label: 'Média', value: 'media' },
      { label: 'Alta', value: 'alta' }
    ];

    const statusList = [
      { label: 'Pendente', value: 'pendente' },
      { label: 'Concluída', value: 'concluida' }
    ];

    const rules = {
      obrigatorio: (v) => !!v || 'Campo obrigatório'
    };

    const carregarTarefa = async () => {
      const id = route.params.id;
      if (!id) return;

      isEdit.value = true;

      try {
        const res = await api.get(`/tarefas/${id}`);
        const t = res.data;

        form.titulo = t.titulo;
        form.descricao = t.descricao || '';
        form.prioridade = t.prioridade || 'media';
        form.status = t.status || 'pendente';
        form.data_limite = t.data_limite
          ? t.data_limite.substring(0, 10) // YYYY-MM-DD
          : null;
      } catch (err) {
        console.error('Erro ao carregar tarefa', err);
        alert('Erro ao carregar tarefa.');
        router.push('/tarefas');
      }
    };

    const salvar = async () => {
      if (!form.titulo) {
        alert('Título é obrigatório.');
        return;
      }

      salvando.value = true;
      const payload = {
        titulo: form.titulo,
        descricao: form.descricao || null,
        prioridade: form.prioridade,
        status: form.status,
        data_limite: form.data_limite || null
      };

      try {
        if (isEdit.value) {
          const id = route.params.id;
          await api.put(`/tarefas/${id}`, payload);
          alert('Tarefa atualizada com sucesso!');
        } else {
          await api.post('/tarefas', payload);
          alert('Tarefa criada com sucesso!');
        }

        router.push('/tarefas');
      } catch (err) {
        console.error('Erro ao salvar tarefa', err);
        alert('Erro ao salvar tarefa.');
      } finally {
        salvando.value = false;
      }
    };

    onMounted(() => {
      if (route.name === 'TarefaEdit' && route.params.id) {
        carregarTarefa();
      }
    });

    return {
      form,
      prioridades,
      statusList,
      rules,
      formValido,
      salvando,
      isEdit,
      salvar
    };
  }
};
</script>

<style scoped>
.my-6 {
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
}
</style>

