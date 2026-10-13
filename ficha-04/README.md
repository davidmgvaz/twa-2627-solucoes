# Ficha 04 — O catálogo em Vue · Your catalog in Vue

Aula 04 (15/10/2026) · solução de referência · reference solution

**PT** — O catálogo da Ficha 03 passa a ser **um componente Vue** (`src/App.vue`). O `catalog.js` e o `items.json` são os mesmos; o `state` passa a ser um `ref` por campo, o `visibleItems()` passa a `computed`, o `render()` **desaparece** — o template é o render, e o Vue sabe quando o voltar a correr.
**EN** — The Ficha 03 catalog becomes **one Vue component** (`src/App.vue`). `catalog.js` and `items.json` are the same; the `state` becomes one `ref` per field, `visibleItems()` becomes a `computed`, and `render()` **is gone** — the template is the render, and Vue knows when to run it again.

```sh
npm install
npm run dev        # http://localhost:5173 — pesquisa · categoria · ordenação · detalhe ao clicar
node check.js      # asserções sobre catalog.js; silêncio = tudo bem · silence = all good
```

## Estrutura · Structure

| Ficheiro · File | Papel · Role |
|---|---|
| `index.html` | só `<div id="app">` + `main.js` · just the mount point |
| `src/main.js` | `createApp(App).mount('#app')` |
| `src/App.vue` | estado (`ref`), derivados (`computed`), `load()`, template com os três estados, detalhe · state, derived values, load, template |
| `src/components/ItemList.vue` | **bónus A** — a lista como componente filho (`props` + `emit`) · the list as a child component |
| `src/catalog.js` | o da Ficha 03, sem alterações · Ficha 03's, unchanged |
| `check.js` | as asserções da Ficha 03, sem alterações · Ficha 03's assertions, unchanged |

## O que se verifica · What to check

1. **Nenhum `document.querySelector`, nenhum `render()`** — o DOM é descrito no template; os *handlers* só escrevem nos refs. · No DOM code: the template describes it, handlers only write refs.
2. `.value` no `<script>`, nunca no template. · `.value` in script, never in the template.
3. `visible`, `cats`, `selected` são `computed` (derivados do estado), não refs mantidos à mão. · derived values are `computed`, not hand-synced refs.
4. Os três estados com `v-if` / `v-else-if` / `v-else`; *Retry* chama `load()` outra vez. · the three states as markup; Retry calls `load()` again.
5. `v-for` sempre com `:key="item.id"` (a lista reordena). · always a key, the list reorders.
6. `{{ }}` escapa: `<b>hi</b>` no nome de um item aparece como texto. · interpolation escapes.
7. Escrever na pesquisa não perde o foco — o Vue mantém o nó `<input>`; `query = ''` no botão *Clear* esvazia a caixa (o ref é a verdade). · no focus loss; the ref is the truth.

## Bónus incluídos · Bonuses included

- **A** — `ItemList.vue` com `defineProps` (`items`, `selectedId`) e `defineEmits(['select'])` — a Aula 05 explica o par props/emits; aqui é só a antevisão. · a preview of props/emits.
- **B** — `counter` (`computed`: "N of M items") e o botão *Clear* que escreve `query = ''`. · computed counter and a Clear button.
- **C** (não incluído · not included) — `v-html` com `<img src=x onerror="alert(1)">` num item: o XSS da Aula 03 outra vez; voltar a `{{ }}`. · the XSS demo; go back to interpolation.

## Erros comuns · Common mistakes

- `count++` em vez de `count.value++` → nada atualiza, sem erro. · missing `.value` → nothing updates, no error.
- `{{ items.value.length }}` no template → `undefined`. · `.value` in the template.
- `await load()` no topo do `<script setup>` → componente assíncrono, precisa de `<Suspense>`; chamar `load()` sem `await`. · a top-level `await` needs Suspense.
- `v-for` sem `:key` (aviso na consola) ou `:key="i"` numa lista que reordena. · missing or index key.
- Escrever num ref dentro de um `computed`. · side effects inside a `computed`.
- Caminho errado em `npm run dev`: o Vite responde **200** com `index.html` → `res.json()` lança *Unexpected token '<'* (igual à Ficha 03). · wrong path → Vite answers 200 with index.html.

Dependências: Vue 3.5 + Vite 8 (`@vitejs/plugin-vue`); Node 22. · Dependencies: Vue 3.5 + Vite 8; Node 22.
