<script setup>
// NotFound.vue — a rota apanha-tudo (/:pathMatch(.*)*): o 404 de uma SPA é um componente, não uma resposta do servidor.
// The catch-all route (/:pathMatch(.*)*): a SPA's 404 is a component, not a server response.
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <h2>Not found</h2>
  <p>There is nothing at <code>{{ route.path }}</code>. <RouterLink to="/">Back to the catalog</RouterLink>.</p>
</template>
