# Ficha 06 — Rotas e paginação · Routes and pagination

Aula 06 (29/10/2026) · solução de referência · reference solution

**PT** — O catálogo da Ficha 05 ganha **um URL por ecrã** (Vue Router): `/` lista, `/items/:id` detalhe, `/items/new` formulário (e `/items/:id/edit`, bónus A da Ficha 05 como rota). O `App.vue` deixa de ser o dono do estado — é a moldura (`<nav>` + `<RouterView>`); os itens vivem em **`store.js`**, estado ao nível do módulo que sobrevive à navegação. Uma página nova, `/pokemon`, **pagina** a PokéAPI com a página **no URL** (`?page=3`). Os componentes `ItemList`, `ItemDetail` e `ItemForm` **não mudaram** desde a Ficha 05.
**EN** — Ficha 05's catalog gets **one URL per screen** (Vue Router): `/` list, `/items/:id` detail, `/items/new` form (and `/items/:id/edit`, Ficha 05's bonus A as a route). `App.vue` is no longer the owner of the state — it is the frame (`<nav>` + `<RouterView>`); the items live in **`store.js`**, module-level state that survives navigation. A new page, `/pokemon`, **paginates** the PokéAPI with the page **in the URL** (`?page=3`). The `ItemList`, `ItemDetail` and `ItemForm` components **did not change** since Ficha 05.

```sh
npm install
npm run dev        # http://localhost:5173 — try /items/3, /items/new, /pokemon?page=4, /nothing
node check.js      # asserções sobre catalog.js; silêncio = tudo bem · silence = all good
```

## Estrutura · Structure

| Ficheiro · File | Papel · Role |
|---|---|
| `src/router.js` | a tabela URL → componente; `:id` / `:name` são parâmetros; rota apanha-tudo no fim; `/pokemon` é *lazy* (bónus B) · the URL → component table |
| `src/main.js` | `createApp(App).use(router).mount('#app')` |
| `src/App.vue` | a moldura: `<nav>` com `<RouterLink>` + `<RouterView>` · the frame |
| `src/store.js` | `items`/`status`/`error`/`load()`/`ensureLoaded()`/`addItem()`/`updateItem()` — estado fora dos componentes · state outside components |
| `src/pages/CatalogPage.vue` | controlos + `ItemList`; `@select` → `router.push`; a pesquisa no URL `?q=` (bónus A) · the list page |
| `src/pages/ItemPage.vue` | `Number(route.params.id)` → `computed` sobre o store; "not found" · the detail from the URL |
| `src/pages/NewItemPage.vue` · `EditItemPage.vue` | `ItemForm` com o seu URL; depois de guardar, `router.push` para o item · the form with its own URL |
| `src/api/pokeapi.js` | `list(page)` traduz página → `offset`/`limit`; `get(name)`; `PAGE = 20` — os URLs só aqui · URLs live only here |
| `src/pages/PokemonPage.vue` | `page` **computed do `route.query`**, `useLoad` + `watch(page, load)`, *Prev*/*Next* com `router.push({ query })`; respostas fora de ordem ignoradas (bónus C) · the paginated page |
| `src/pages/PokemonDetailPage.vue` | `useLoad(() => get(route.params.name))` + `watch(() => route.params.name, load)` — o componente reutilizado · the reused component |
| `src/pages/NotFound.vue` | o 404 de uma SPA é um componente · a SPA's 404 is a component |
| `src/components/*`, `src/composables/useLoad.js`, `src/catalog.js`, `check.js`, `public/items.json` | os da Ficha 05, sem alterações · Ficha 05's, unchanged |

## O que se verifica · What to check

1. **Um URL por ecrã**: *reload* em `/items/3` ou `/pokemon?page=4` mantém o ecrã; *back* funciona em todo o lado; nenhum `<a href>` para ecrãs internos (o separador *Network* não mostra pedidos de documento ao navegar). · One URL per screen: reload keeps the screen, back works, no internal `<a href>`.
2. `route.params.id` é uma **string** — `Number()` antes de comparar. · Params are strings.
3. O estado está **fora** das páginas (`store.js`): criar um item em `/items/new`, voltar a `/` — está lá; *reload* — desapareceu (o M2 persiste). · State lives outside the pages; it survives navigation, not reload.
4. A página de resultados vive **no URL** (`?page=`), não num `ref`: os botões mudam o URL, o `watch` recarrega. · The page lives in the URL, not in a ref.
5. `useLoad` faz o primeiro `load` (`onMounted`); `watch(page, load)` e `watch(() => route.params.name, load)` fazem os seguintes — a mesma rota **reutiliza** o componente. · The same route reuses the component; watch the param.
6. Um id errado → "not found" (componente); um caminho errado → a rota apanha-tudo. · Wrong id → not found; wrong path → catch-all.
7. `ItemList`, `ItemDetail`, `ItemForm` não mudaram: o contrato props/emits da Ficha 05 aguenta uma arquitetura nova. · The Ficha 05 components are untouched.

## Bónus incluídos · Bonuses included

- **A** — a pesquisa do catálogo no URL (`?q=`), com `router.replace` (uma tecla não é uma entrada no histórico). · the search in the URL.
- **B** — rotas *lazy* para `/pokemon` e `/pokemon/:name` (`component: () => import(...)`): um *chunk* à parte no separador *Network*. · lazy routes.
- **C** — respostas fora de ordem ignoradas na paginação (contador de pedidos). · stale answers ignored.
- *(D — Pinia — não incluído: `store.js` é o mesmo padrão; ver <https://pinia.vuejs.org>.) · not included.*

## Erros comuns · Common mistakes

- `app.use(router)` em falta → "Failed to resolve component: RouterLink". · Missing `use(router)`.
- `<RouterView />` em falta no `App.vue` → página em branco sem erro. · Missing `<RouterView>` → blank page.
- Comparar `route.params.id` (string) com `item.id` (número) → "not found" com o id certo. · String vs number.
- Cada página com o seu `ref([])` em vez de importar o `store.js` → os itens desaparecem ao navegar. · Per-page state instead of the store.
- `const page = ref(1)` → *reload* volta à página 1 e não há link para partilhar. · A page ref instead of the URL.
- `watch(page, load, { immediate: true })` **e** o `onMounted` do `useLoad` → dois pedidos ao arrancar. · Double first load.
- `useLoad()` chamado dentro de um *handler* → "onMounted is called when there is no active component instance". · Composables at the top of setup.

Dependências: Vue 3.5 + Vue Router 5 + Vite 8 (`@vitejs/plugin-vue`); Node 22. · Dependencies: Vue 3.5 + Vue Router 5 + Vite 8; Node 22.
