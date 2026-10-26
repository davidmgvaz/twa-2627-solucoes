<script setup>
// ItemList.vue — a lista como componente filho. Recebe os itens por props (só leitura)
// e avisa o pai do clique com um emit: dados para baixo, eventos para cima.
// The list as a child component. It receives the items through props (read-only)
// and reports a click with an emit: data down, events up.
defineProps({
  items: { type: Array, required: true },
  selectedId: { type: Number, default: null },
})
const emit = defineEmits(['select'])
</script>

<template>
  <ul id="list">
    <li
      v-for="item in items"
      :key="item.id"
      :class="{ selected: item.id === selectedId }"
      @click="emit('select', item.id)"
    >
      {{ item.name }} · {{ item.price.toFixed(2) }} €
    </li>
  </ul>
</template>

<style scoped>
#list { list-style: none; padding: 0; margin: 0 0 1rem; }
#list li { padding: .4rem .6rem; border-bottom: 1px solid #ddd; cursor: pointer; }
#list li:hover { background: #eee; }
#list li.selected { background: #e8e0ea; font-weight: 600; }
</style>
