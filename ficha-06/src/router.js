// router.js — a tabela URL → componente, uma rota por ecrã. Resolvida no browser, sem pedido ao servidor
// (compara com urls.py / routes/web.php). `:id` é um parâmetro; o ecrã lê-o com useRoute().params.id.
// The URL → component table, one route per screen. Resolved in the browser, no request to the server
// (compare with urls.py / routes/web.php). `:id` is a param; the screen reads it with useRoute().params.id.
import { createRouter, createWebHistory } from 'vue-router'
import CatalogPage from './pages/CatalogPage.vue'
import ItemPage from './pages/ItemPage.vue'
import NewItemPage from './pages/NewItemPage.vue'
import EditItemPage from './pages/EditItemPage.vue'
import NotFound from './pages/NotFound.vue'

const routes = [
  { path: '/', name: 'catalog', component: CatalogPage },
  // order doesn't matter: the Router ranks static paths above dynamic ones · a ordem não importa
  { path: '/items/new', name: 'new-item', component: NewItemPage },
  { path: '/items/:id', name: 'item', component: ItemPage },
  { path: '/items/:id/edit', name: 'edit-item', component: EditItemPage }, // bonus A of Ficha 05, now a route
  // bonus B: a lazy route — this page's code is a separate chunk, fetched on first visit (see the Network tab)
  // bónus B: rota lazy — o código desta página é um chunk à parte, pedido na primeira visita
  { path: '/pokemon', name: 'pokemon', component: () => import('./pages/PokemonPage.vue') },
  { path: '/pokemon/:name', name: 'pokemon-detail', component: () => import('./pages/PokemonDetailPage.vue') },
  // catch-all, last · apanha-tudo, no fim
  { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFound },
]

export default createRouter({
  history: createWebHistory(), // real URLs through the History API · URLs reais via History API
  routes,
})
