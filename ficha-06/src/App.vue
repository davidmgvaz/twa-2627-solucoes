<script setup>
// App.vue — já não é o dono do estado: é a MOLDURA. A navegação e o ecrã da rota atual (<RouterView>).
// O estado partilhado vive em store.js; cada página carrega o que precisa.
// No longer the owner of the state: it is the FRAME. The navigation and the current route's screen (<RouterView>).
// Shared state lives in store.js; each page loads what it needs.
</script>

<template>
  <header>
    <h1>Catalog</h1>
    <nav>
      <!-- <RouterLink> = an <a> that does NOT reload the page · um <a> que NÃO recarrega a página -->
      <RouterLink to="/">Items</RouterLink>
      <RouterLink to="/items/new">New item</RouterLink>
      <RouterLink to="/pokemon">Pokémon</RouterLink>
    </nav>
  </header>

  <!-- the matched route's component is rendered here · o componente da rota atual entra aqui -->
  <RouterView />
</template>

<style scoped>
header { display: flex; align-items: baseline; gap: 1.5rem; margin-bottom: 1rem; }
header h1 { margin: 0; }
nav { display: flex; gap: 1rem; }
nav a { color: #5a1a3a; text-decoration: none; padding: .2rem 0; border-bottom: 2px solid transparent; }
nav a.router-link-active { border-bottom-color: #5a1a3a; font-weight: 600; }
</style>
