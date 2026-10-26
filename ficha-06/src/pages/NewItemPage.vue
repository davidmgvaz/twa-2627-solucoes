<script setup>
// NewItemPage.vue — o formulário da Ficha 05, agora com o seu próprio URL. Depois de guardar: navegar em código
// (router.push) para o item novo. É isto que o <Entidade>Form do M1 faz sobre uma API só de leitura: guarda no store.
// Ficha 05's form, now with its own URL. After saving: navigate in code (router.push) to the new item. This is what
// M1's <Entity>Form does over a read-only API: it saves into the store.
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { categories } from '../catalog.js'
import { items, addItem, ensureLoaded } from '../store.js'
import ItemForm from '../components/ItemForm.vue'

const router = useRouter()
onMounted(ensureLoaded)
const cats = computed(() => categories(items.value ?? []))

function onSave(item) {
  const id = addItem(item)
  router.push({ name: 'item', params: { id } }) // a save is a place you can't go "back" to → push is fine
}
</script>

<template>
  <p><RouterLink to="/">← Items</RouterLink></p>
  <ItemForm v-if="items" :cats="cats" @save="onSave" />
  <p v-else id="status">Loading…</p>
</template>
