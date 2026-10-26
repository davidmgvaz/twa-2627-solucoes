<script setup>
// PokemonDetailPage.vue — o detalhe pelo URL, carregado da API (não do store): useLoad + get(route.params.name).
// Ir de /pokemon/pikachu para /pokemon/raichu REUTILIZA este componente (mesma rota) — o onMounted não corre outra
// vez; o watch sobre o parâmetro é o que volta a carregar.
// The detail from the URL, loaded from the API (not the store): useLoad + get(route.params.name).
// Going from /pokemon/pikachu to /pokemon/raichu REUSES this component (same route) — onMounted does not run again;
// the watch on the param is what reloads.
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useLoad } from '../composables/useLoad.js'
import { get } from '../api/pokeapi.js'

const route = useRoute()
const { status, error, data: p, load } = useLoad(() => get(route.params.name))
watch(() => route.params.name, load) // same component, new param → reload · mesmo componente, parâmetro novo → recarregar
</script>

<template>
  <p><RouterLink :to="{ name: 'pokemon' }">← Pokémon</RouterLink></p>
  <p v-if="status === 'loading'" id="status">Loading…</p>
  <p v-else-if="status === 'error'" id="status">Error: {{ error }}</p>
  <section v-else id="detail">
    <h2>#{{ p.id }} {{ p.name }}</h2>
    <img v-if="p.sprites?.front_default" :src="p.sprites.front_default" :alt="p.name" width="96" height="96" />
    <dl>
      <dt>Types</dt><dd>{{ p.types.map((t) => t.type.name).join(', ') }}</dd>
      <dt>Height</dt><dd>{{ p.height / 10 }} m</dd>
      <dt>Weight</dt><dd>{{ p.weight / 10 }} kg</dd>
    </dl>
    <p>
      <!-- the "reused component" case, on purpose · o caso "componente reutilizado", de propósito -->
      <RouterLink v-if="p.id > 1" :to="{ name: 'pokemon-detail', params: { name: p.id - 1 } }">‹ #{{ p.id - 1 }}</RouterLink>
      ·
      <RouterLink :to="{ name: 'pokemon-detail', params: { name: p.id + 1 } }">#{{ p.id + 1 }} ›</RouterLink>
    </p>
  </section>
</template>

<style scoped>
#status { color: #666; }
#detail { padding: 1rem; background: #fff; border: 1px solid #ddd; }
#detail h2 { text-transform: capitalize; margin-top: 0; }
#detail dl { display: grid; grid-template-columns: max-content 1fr; gap: .25rem 1rem; }
#detail dt { color: #666; }
#detail a { color: #5a1a3a; }
</style>
