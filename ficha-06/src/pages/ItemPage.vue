<script setup>
// ItemPage.vue — o ecrã de detalhe: o id vem do URL (/items/:id). route.params.id é uma STRING ("3") — converter.
// The detail screen: the id comes from the URL (/items/:id). route.params.id is a STRING ("3") — convert it.
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { items, status, ensureLoaded } from '../store.js'
import ItemDetail from '../components/ItemDetail.vue'

const route = useRoute()
onMounted(ensureLoaded) // a reload on /items/3 lands here first — the store is empty, load it · num reload o store está vazio

const id = computed(() => Number(route.params.id))
const item = computed(() => (items.value ?? []).find((i) => i.id === id.value))
</script>

<template>
  <p><RouterLink to="/">← Items</RouterLink></p>
  <p v-if="status !== 'ready'" id="status">Loading…</p>
  <p v-else-if="!item" id="status">Item {{ route.params.id }} not found.</p>
  <ItemDetail v-else :item="item">
    <!-- bonus C of Ficha 05 (the slot) now carries a link to the edit route · agora leva um link para a rota de edição -->
    <p><RouterLink :to="{ name: 'edit-item', params: { id } }">Edit</RouterLink></p>
  </ItemDetail>
</template>

<style scoped>
#status { color: #666; }
</style>
