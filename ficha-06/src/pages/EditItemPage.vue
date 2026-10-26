<script setup>
// EditItemPage.vue — bónus A da Ficha 05 (modo editar) como rota própria: /items/:id/edit. O mesmo ItemForm,
// com :item; o submit emite `update`, o cancel volta ao detalhe.
// Ficha 05's bonus A (edit mode) as its own route: /items/:id/edit. The same ItemForm, with :item; submit emits
// `update`, cancel goes back to the detail.
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { categories } from '../catalog.js'
import { items, updateItem, ensureLoaded } from '../store.js'
import ItemForm from '../components/ItemForm.vue'

const route = useRoute()
const router = useRouter()
onMounted(ensureLoaded)

const id = computed(() => Number(route.params.id))
const item = computed(() => (items.value ?? []).find((i) => i.id === id.value) ?? null)
const cats = computed(() => categories(items.value ?? []))

function onUpdate(updated) {
  updateItem(updated)
  router.push({ name: 'item', params: { id: id.value } })
}
</script>

<template>
  <p><RouterLink :to="{ name: 'item', params: { id } }">← Back</RouterLink></p>
  <p v-if="!items" id="status">Loading…</p>
  <p v-else-if="!item" id="status">Item {{ route.params.id }} not found.</p>
  <ItemForm v-else :cats="cats" :item="item" @update="onUpdate" @cancel="router.back()" />
</template>
