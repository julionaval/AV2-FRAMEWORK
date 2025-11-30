<template>
  <div>
    <h2>Teste TarefaForm (minimal)</h2>
    <form @submit.prevent="salvar">
      <label>Título</label>
      <input v-model="titulo" />
      <button type="submit">Salvar</button>
    </form>
  </div>
</template>

<script>
import { ref } from 'vue';
export default {
  name: 'TarefaForm',
  setup() {
    const titulo = ref('');
    const salvar = () => { console.log('salvar', titulo.value); alert('Salvar: ' + titulo.value); };
    return { titulo, salvar };
  }
};
</script>
