<script setup>
// App.vue — o dono do estado. Os filhos recebem props e emitem eventos; só aqui se escreve em `items`.
// The owner of the state. Children receive props and emit events; `items` is written only here.
import { computed, ref, watch } from 'vue'
import { byCategory, categories, search, sortByPrice } from './catalog.js'
import { getJSON } from './api/getJSON.js'
import { useLoad } from './composables/useLoad.js'
import ItemList from './components/ItemList.vue'
import ItemDetail from './components/ItemDetail.vue'
import ItemForm from './components/ItemForm.vue'

// --- the three states + load(), from the composable (onMounted lives inside it)
// os três estados + load(), vindos do composable (o onMounted está lá dentro)
const { status, error, data: items, load } = useLoad(() => getJSON('/items.json'))

// --- the rest of the state · o resto do estado
const query = ref(localStorage.getItem('query') ?? '') // bonus B: restored on start · bónus B
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)
const editingId = ref(null) // bonus A · bónus A

// --- derived values · valores derivados (items is null until the first load resolves)
const visible = computed(() => {
  let list = search(items.value ?? [], query.value)
  if (category.value) list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})
const cats = computed(() => categories(items.value ?? []))
const selected = computed(() => (items.value ?? []).find((i) => i.id === selectedId.value))
const editing = computed(() => (items.value ?? []).find((i) => i.id === editingId.value) ?? null)
const counter = computed(() => `${visible.value.length} of ${items.value?.length ?? 0} items`)
const nextId = computed(() => Math.max(0, ...(items.value ?? []).map((i) => i.id)) + 1)

// --- effects · efeitos: watch, not computed (they DO something; they don't derive a value)
watch(query, () => { selectedId.value = null }) // searching clears the selection
watch(query, (q) => localStorage.setItem('query', q)) // bonus B: persist the search · bónus B

// --- handlers: the only place `items` changes · o único sítio onde `items` muda
function addItem(item) {
  items.value.push({ id: nextId.value, ...item })
  selectedId.value = nextId.value - 1 // show the new one · mostra o novo
}
function updateItem(item) { // bonus A · bónus A
  const i = items.value.findIndex((x) => x.id === item.id)
  items.value[i] = item
  editingId.value = null
}
function toggleSort() {
  sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
}
</script>

<template>
  <h1>Catalog</h1>

  <form id="controls" @submit.prevent>
    <input v-model="query" type="search" placeholder="Search…" autocomplete="off" />
    <select v-model="category">
      <option value="">All</option>
      <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
    </select>
    <button type="button" @click="toggleSort">Price {{ sortDir === 'desc' ? '↓' : '↑' }}</button>
    <button type="button" @click="query = ''">Clear</button>
  </form>

  <p v-if="status === 'loading'" id="status">Loading…</p>
  <p v-else-if="status === 'error'" id="status">
    Error: {{ error }}
    <button type="button" @click="load">Retry</button>
  </p>
  <template v-else>
    <p id="status">{{ visible.length ? counter : `No results for "${query}"` }}</p>

    <!-- data down (props), events up (emits) · dados para baixo, eventos para cima -->
    <ItemList :items="visible" :selected-id="selectedId" @select="selectedId = $event" />

    <ItemDetail v-if="selected" :item="selected">
      <!-- bonus C: this goes into the <slot> · bónus C: isto entra no <slot> -->
      <p><button type="button" @click="editingId = selected.id">Edit</button></p>
    </ItemDetail>

    <!-- the form owns its draft; it hands us one clean object · o form tem o seu rascunho; entrega um objeto limpo -->
    <ItemForm :cats="cats" :item="editing" @save="addItem" @update="updateItem" @cancel="editingId = null" />
  </template>
</template>

<style scoped>
#controls { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .5rem; }
#controls input, #controls select, #controls button { font: inherit; padding: .4rem .6rem; }
#status { color: #666; min-height: 1.5em; }
</style>
