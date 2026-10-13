<script setup>
// App.vue — o catálogo da Ficha 03 como um componente Vue. Não há render(): o template é o render.
// The Ficha 03 catalog as one Vue component. There is no render(): the template is the render.
import { computed, ref } from 'vue'
import { byCategory, categories, search, sortByPrice } from './catalog.js'
import ItemList from './components/ItemList.vue' // bónus A · bonus A

// --- state: one ref per field of Ficha 03's state object · um ref por campo do state da Ficha 03
const status = ref('loading') // 'loading' | 'error' | 'ready'
const error = ref(null)
const items = ref([])
const query = ref('')
const category = ref('')
const sortDir = ref('desc')
const selectedId = ref(null)

// --- derived values: Ficha 03's visibleItems() and fillCategories(), now cached and automatic
// valores derivados: o visibleItems() e o fillCategories() da Ficha 03, agora em cache e automáticos
const visible = computed(() => {
  let list = search(items.value, query.value)
  if (category.value) list = byCategory(list, category.value)
  return sortByPrice(list, sortDir.value)
})
const cats = computed(() => categories(items.value))
const selected = computed(() => items.value.find((i) => i.id === selectedId.value))
// bonus B — "N of M items" · bónus B
const counter = computed(() => `${visible.value.length} of ${items.value.length} items`)
// the nested object of the selected item (author, specs…) · o objeto aninhado do item selecionado
const nested = computed(() =>
  Object.entries(selected.value ?? {}).find(([, v]) => v && typeof v === 'object' && !Array.isArray(v)),
)

// --- load(): the same fetch + three states as Ficha 03, writing to refs instead of calling render()
// o mesmo fetch + três estados da Ficha 03, a escrever nos refs em vez de chamar render()
async function load(url = '/items.json') {
  status.value = 'loading'
  error.value = null
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
    items.value = await res.json() // throws "Unexpected token '<'" if Vite answered with index.html
    status.value = 'ready'
  } catch (err) {
    status.value = 'error'
    error.value = err.message
  }
  // no finally { render() } — Vue re-renders because the refs changed · o Vue re-renderiza porque os refs mudaram
}

function toggleSort() {
  sortDir.value = sortDir.value === 'desc' ? 'asc' : 'desc'
}

load() // not awaited: the component renders "Loading…" and fills in when the promise resolves (onMounted → Aula 05)
</script>

<template>
  <h1>Catalog</h1>

  <!-- controls: v-model binds the value in and listens for changes out · liga o valor e ouve as alterações -->
  <form id="controls" @submit.prevent>
    <input v-model="query" type="search" placeholder="Search…" autocomplete="off" />
    <select v-model="category">
      <option value="">All</option>
      <option v-for="c in cats" :key="c" :value="c">{{ c }}</option>
    </select>
    <button type="button" @click="toggleSort">Price {{ sortDir === 'desc' ? '↓' : '↑' }}</button>
    <button type="button" @click="query = ''">Clear</button> <!-- bonus B: the ref is the truth, the input follows -->
  </form>

  <!-- the three states, as markup · os três estados, em markup -->
  <p v-if="status === 'loading'" id="status">Loading…</p>
  <p v-else-if="status === 'error'" id="status">
    Error: {{ error }}
    <button type="button" @click="load()">Retry</button>
  </p>
  <template v-else>
    <p id="status">{{ visible.length ? counter : `No results for "${query}"` }}</p>

    <!-- bonus A: the list is a child component; it receives the items (props) and tells us which was clicked (emit, Aula 05) -->
    <ItemList :items="visible" :selected-id="selectedId" @select="selectedId = $event" />

    <section v-if="selected" id="detail">
      <h2>{{ selected.name }}</h2>
      <dl>
        <dt>Category</dt><dd>{{ selected.category }}</dd>
        <dt>Price</dt><dd>{{ selected.price.toFixed(2) }} €</dd>
        <dt>Tags</dt><dd>{{ selected.tags.join(', ') }}</dd>
        <template v-if="nested">
          <template v-for="(v, k) in nested[1]" :key="k">
            <dt>{{ nested[0] }}.{{ k }}</dt><dd>{{ v }}</dd>
          </template>
        </template>
      </dl>
    </section>
  </template>
</template>

<style scoped>
/* only this component's elements · só os elementos deste componente */
#controls { display: flex; gap: .5rem; flex-wrap: wrap; margin-bottom: .5rem; }
#controls input, #controls select, #controls button { font: inherit; padding: .4rem .6rem; }
#status { color: #666; min-height: 1.5em; }
#detail dl { display: grid; grid-template-columns: max-content 1fr; gap: .25rem 1rem; }
#detail dt { color: #666; }
</style>
