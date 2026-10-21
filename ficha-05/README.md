# Ficha 05 — Componentes e formulários · Components and forms

Aula 05 (22/10/2026) · solução de referência · reference solution

**PT** — O `App.vue` da Ficha 04 **parte-se** em componentes: `ItemList`, `ItemDetail` e um `ItemForm` que cria itens. O pai continua dono do estado; os filhos recebem **props** (só leitura) e **emitem** eventos. Os três estados + `load()` passam para um **composable** (`useLoad`), com o `onMounted` lá dentro; um `watch` limpa a seleção quando a pesquisa muda. O `catalog.js` e o `items.json` são os mesmos (quinta ficha).
**EN** — Ficha 04's `App.vue` is **split** into components: `ItemList`, `ItemDetail` and an `ItemForm` that creates items. The parent still owns the state; children receive **props** (read-only) and **emit** events. The three states + `load()` move into a **composable** (`useLoad`), with `onMounted` inside it; a `watch` clears the selection when the search changes. `catalog.js` and `items.json` are the same (fifth ficha).

```sh
npm install
npm run dev        # http://localhost:5173 — lista · detalhe · formulário · pesquisa, categoria, ordenação
node check.js      # asserções sobre catalog.js; silêncio = tudo bem · silence = all good
```

## Estrutura · Structure

| Ficheiro · File | Papel · Role |
|---|---|
| `src/App.vue` | **dono do estado**: `useLoad`, `query`/`category`/`sortDir`/`selectedId`, os `computed`, os *handlers* que escrevem em `items` · **owner of the state** |
| `src/components/ItemList.vue` | `defineProps({ items, selectedId })` + `defineEmits(['select'])` |
| `src/components/ItemDetail.vue` | `defineProps({ item })`, `computed` sobre a prop, `<slot>` (bónus C) |
| `src/components/ItemForm.vue` | rascunho `reactive`, `v-model.trim`/`.number`, `errors`/`isValid` como `computed`, `@submit.prevent`, `emit('save', obj)`; modo editar (bónus A) · draft, validation, one emit |
| `src/composables/useLoad.js` | `status`/`error`/`data`/`load()` + `onMounted(load)` — os três estados escritos uma vez · the three states written once |
| `src/api/getJSON.js` | o `fetch` com `res.ok` (igual ao template do projeto) · the fetch from the project template |
| `src/catalog.js` · `check.js` · `public/items.json` | os da Ficha 03/04, sem alterações · Ficha 03/04's, unchanged |

## O que se verifica · What to check

1. **Dados para baixo, eventos para cima**: nenhum filho escreve em `items`; `ItemList` emite `select`, `ItemForm` emite `save`. · Data down, events up: no child writes to `items`.
2. Props **só de leitura**: `props.items.push()` num filho dá o aviso *"Attempting to mutate prop"*. · Props are read-only.
3. O formulário tem o seu **rascunho** (`reactive`) e entrega **um objeto limpo** (`price` número, `tags` array); o pai faz `push` com um `id` novo e a lista/`<select>` reagem sozinhos. · The form owns a draft and hands over one clean object.
4. Validação dupla: atributos HTML **e** `errors`/`isValid` (`computed`); o `submit()` verifica `isValid` mesmo com o botão desativado. · Validate in HTML and in a computed; check again in `submit()`.
5. `onMounted(load)` dentro do `useLoad`; `load` devolvido para o *Retry*. · `onMounted` lives in the composable; `load` is returned for Retry.
6. `watch(query, …)` para **efeitos** (limpar `selectedId`, `localStorage`); `computed` para **valores** (`visible`, `cats`, `nextId`). · watch for effects, computed for values.
7. `items` é `null` até o primeiro `load()` resolver — os `computed` usam `items.value ?? []`. · `items` is `null` before the first load.

## Bónus incluídos · Bonuses included

- **A** — modo editar: `ItemForm` recebe `:item`; um `watch(() => props.item, …, { immediate: true })` copia a prop para o rascunho (cópia, não ligação) e o submit emite `update`. O botão *Edit* vem do pai, pelo `<slot>` do `ItemDetail`. · edit mode: copy the prop into the draft, emit `update`.
- **B** — `watch(query)` → `localStorage`; `query` arranca com `localStorage.getItem('query') ?? ''`. · persist the search.
- **C** — `<slot />` no `ItemDetail`; o pai injeta o botão *Edit*. · a slot for the parent's footer.

## Erros comuns · Common mistakes

- Mutar uma prop no filho (`props.items.push`) — funciona "por acaso" até o pai recarregar. · Mutating a prop in the child.
- `emit('selected', …)` no filho e `@select` no pai — nomes diferentes, nada acontece. · Mismatched event names.
- Esquecer `.number` → `price` é uma string, a ordenação fica errada. · Missing `.number`.
- `onMounted(load())` (chama já) em vez de `onMounted(load)`. · Calling instead of passing the function.
- `useLoad()` chamado dentro de um *handler* ou de uma função `async` → "onMounted is called when there is no active component instance". Tem de ser no topo do `<script setup>`. · Composables are called at the top level of setup.
- Reatribuir o `reactive` (`form = {...}`) em vez de `Object.assign(form, …)`. · Reassigning a reactive loses reactivity.

Dependências: Vue 3.5 + Vite 8 (`@vitejs/plugin-vue`); Node 22. · Dependencies: Vue 3.5 + Vite 8; Node 22.
