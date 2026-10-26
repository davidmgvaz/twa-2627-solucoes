<script setup>
// PokemonPage.vue — uma lista paginada sobre uma API pública. A página vive no URL (?page=3): é o URL que manda,
// não um ref — reload, back e partilhar funcionam sem código extra. useLoad faz o primeiro load (onMounted lá
// dentro); watch(page, load) faz os seguintes (a rota é a mesma, o componente é reutilizado — não volta a montar).
// A paginated list over a public API. The page lives in the URL (?page=3): the URL is in charge, not a ref —
// reload, back and sharing work with no extra code. useLoad does the first load (onMounted inside it);
// watch(page, load) does the rest (same route, the component is reused — it does not mount again).
import { computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLoad } from '../composables/useLoad.js'
import { list, PAGE } from '../api/pokeapi.js'

const route = useRoute()
const router = useRouter()

// the URL is the source of truth · o URL é a fonte de verdade
const page = computed(() => Math.max(1, Number(route.query.page ?? 1) || 1))

// bonus C: ignore answers that arrive out of order (page 3's after page 4's) · bónus C: ignorar respostas fora de ordem
let requests = 0
const { status, error, data, load } = useLoad(async () => {
  const n = ++requests
  const result = await list(page.value)
  if (n !== requests) return data.value // a newer request is in flight — keep what we have · há um pedido mais recente
  return result
})
watch(page, load) // no `immediate`: onMounted already did the first one · sem `immediate`: o onMounted já fez o primeiro

const pages = computed(() => Math.ceil((data.value?.count ?? 0) / PAGE))
function go(p) {
  router.push({ query: { page: p } }) // a page is a place: push, so "back" walks the pages · uma página é um sítio
}
</script>

<template>
  <h2>Pokémon</h2>
  <p id="pager">
    <button type="button" :disabled="page <= 1" @click="go(page - 1)">‹ Prev</button>
    <span>Page {{ page }} of {{ pages || '…' }}</span>
    <button type="button" :disabled="!pages || page >= pages" @click="go(page + 1)">Next ›</button>
  </p>

  <p v-if="status === 'loading'" id="status">Loading…</p>
  <p v-else-if="status === 'error'" id="status">
    Error: {{ error }}
    <button type="button" @click="load">Retry</button>
  </p>
  <p v-else-if="!data.results.length" id="status">Nothing on page {{ page }}.</p>
  <ol v-else id="pokemon" :start="(page - 1) * PAGE + 1">
    <li v-for="p in data.results" :key="p.name">
      <RouterLink :to="{ name: 'pokemon-detail', params: { name: p.name } }">{{ p.name }}</RouterLink>
    </li>
  </ol>
</template>

<style scoped>
#pager { display: flex; gap: 1rem; align-items: center; }
#pager button { font: inherit; padding: .3rem .6rem; }
#status { color: #666; }
#pokemon { columns: 2; margin: 0; }
#pokemon li { padding: .2rem 0; text-transform: capitalize; }
#pokemon a { color: #5a1a3a; }
</style>
