<script setup>
// CatalogPage.vue — a página da lista: controlos + <ItemList>. O estado dos itens vem do store; o texto da
// pesquisa vive no URL (?q=, bónus A) — reload e partilha mantêm a pesquisa.
// The list page: controls + <ItemList>. The items' state comes from the store; the search text lives in the
// URL (?q=, bonus A) — reload and sharing keep the search.
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { byCategory, categories, search, sortByPrice } from '../catalog.js'
import { items, status, error, load, ensureLoaded } from '../store.js'
import ItemList from '../components/ItemList.vue'

const route = useRoute()
const router = useRouter()
onMounted(ensureLoaded) // load once; coming back from /items/3 doesn't fetch again · voltar não volta a carregar

// bonus A: the search lives in the URL. `replace`, not `push`: every keystroke must not become a history entry.
// bónus A: a pesquisa vive no URL. `replace`, não `push`: cada tecla não pode virar uma entrada no histórico.
const query = computed({
  get: () => route.query.q ?? '',
  set: (q) => router.replace({ query: { ...route.query, q: q || undefined } }),
})
const category = ref('')
const sortDir = ref('desc')

const visible = computed(() => {
  let list = search(items.value ?? [], query.value)
  if (category.value) list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})
const cats = computed(() => categories(items.value ?? []))
const counter = computed(() => `${visible.value.length} of ${items.value?.length ?? 0} items`)

function toggleSort() {
  sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
}
</script>

<template>
  <form id="controls" @submit.prevent>
    <input v-model="query" type="search" placeholder="Search…" autocomplete="off" />
    <select v-model="category">
      <option value="">All</option>
      <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
    </select>
    <button type="button" @click="toggleSort">Price {{ sortDir === 'desc' ? '↓' : '↑' }}</button>
    <button type="button" @click="query = ''">Clear</button>
  </form>

  <p v-if="status === 'loading' || status === 'idle'" id="status">Loading…</p>
  <p v-else-if="status === 'error'" id="status">
    Error: {{ error }}
    <button type="button" @click="load">Retry</button>
  </p>
  <template v-else>
    <p id="status">{{ visible.length ? counter : `No results for "${query}"` }}</p>
    <!-- ItemList did not change since Ficha 05: it still emits `select`; the page decides — now it navigates -->
    <!-- o ItemList não mudou desde a Ficha 05: continua a emitir `select`; a página decide — agora navega -->
    <ItemList :items="visible" @select="router.push({ name: 'item', params: { id: $event } })" />
  </template>
</template>

<style scoped>
#controls { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .5rem; }
#controls input, #controls select, #controls button { font: inherit; padding: .4rem .6rem; }
#status { color: #666; min-height: 1.5em; }
</style>
