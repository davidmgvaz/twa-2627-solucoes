# Ficha 03 — O catálogo no browser · Your catalog in the browser

Aula 03 (08/10/2026) · solução de referência · reference solution

**PT** — O catálogo da Ficha 02 passa para o browser: os dados vêm de um ficheiro JSON pedido com `fetch` (`public/items.json`), a lógica é o **mesmo** `catalog.js` (sem alterações, mais `sortByPrice`), e um único `render(state)` desenha a página com `createElement` + `textContent`. Os eventos só mudam o `state`. É o que o Vue vai fazer por vocês na Aula 04.
**EN** — The Ficha 02 catalog moves to the browser: the data comes from a JSON file requested with `fetch` (`public/items.json`), the logic is the **same** `catalog.js` (unchanged, plus `sortByPrice`), and a single `render(state)` draws the page with `createElement` + `textContent`. Events only change the `state`. This is what Vue will do for you in Aula 04.

```sh
npm install
npm run dev        # http://localhost:5173 — pesquisa · categoria · ordenação · detalhe ao clicar
node check.js      # asserções sobre catalog.js, incl. sortByPrice; silêncio = tudo bem · silence = all good
```

`public/items.json` foi gerado a partir do `data.js` da Ficha 02 · was generated from Ficha 02's `data.js`:

```sh
node -e "import('../ficha-02/data.js').then(m => console.log(JSON.stringify(m.items, null, 2)))" > public/items.json
```

## Estrutura · Structure

| Ficheiro · File | Papel · Role |
|---|---|
| `index.html` | controlos **estáticos** (`#q`, `#category`, `#sort`) + zonas que o `render()` preenche (`#status`, `#list`, `#detail`) · static controls + the areas `render()` fills |
| `src/catalog.js` | funções puras da Ficha 02 + `sortByPrice(list, dir)` · Ficha 02's pure functions + `sortByPrice` |
| `src/main.js` | `state`, `load()` (fetch + 3 estados), `render()`, eventos · state, load, render, events |
| `check.js` | `node:assert/strict` sobre `catalog.js`, lê `public/items.json` · assertions over catalog.js |

## O que se verifica · What to check

1. `load()`: `fetch` → `res.ok` → `await res.json()`, dentro de `try`/`catch`/`finally`; os três estados aparecem (`#status`: *Loading…* / *Error: …* + Retry / *N items*). · the three states show.
2. **Nunca** `innerHTML` com dados — `el(tag, text)` cria o nó e usa `textContent`. Teste: `<b>hi</b>` no nome de um item em `items.json` aparece como texto. · never `innerHTML` with data; the `<b>` shows as text.
3. Só `render()` escreve no DOM; os *handlers* mudam o `state` e chamam `render()`. · only `render()` writes the DOM.
4. Os controlos estão fora da zona que `render()` substitui → escrever na pesquisa não perde o foco. · controls outside the re-rendered area → no focus loss.
5. `li.dataset.id` é uma string → `Number(...)` antes de comparar com `item.id`. · dataset values are strings.
6. `sortByPrice` devolve um array novo (`toSorted`) com comparador numérico; `check.js` prova que `items` não muda. · new array, numeric comparator, originals untouched.

## Bónus incluídos · Bonuses included

- **B** — delegação de eventos: um só *listener* de `click` em `#list` (`e.target.closest('li[data-id]')`) · one click listener on the list.
- **C** — botão *Retry* no estado de erro que volta a chamar `load()` · a Retry button in the error state.
- **A** (não incluído · not included) — `Promise.all` com uma segunda fonte: `const [items, extra] = await Promise.all([getJSON('/items.json'), getJSON('https://…')])`.

## Erros comuns · Common mistakes

- `const data = res.json()` sem `await` → `data` é uma Promise, a lista fica vazia, sem erro. · missing `await` → empty list, no error.
- Falta `render()` no `finally` → página presa em *Loading…* quando o `fetch` falha. · stuck on Loading… when fetch fails.
- Caminho errado em `npm run dev`: o Vite responde **200** com `index.html` → `res.json()` lança *Unexpected token '<'*. · wrong path: Vite answers 200 with index.html.
- `innerHTML = \`<li>${item.name}</li>\`` — XSS; qualquer nome vindo do JSON vira HTML. · XSS.
- Controlos dentro da zona que `render()` reconstrói → perdem o foco a cada tecla. · controls inside the re-rendered area lose focus.

Sem dependências além do Vite; Node 22 (`toSorted`, `Object.groupBy`, `structuredClone`). · No dependencies besides Vite; Node 22.
