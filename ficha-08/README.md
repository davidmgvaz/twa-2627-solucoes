# Ficha 08 — Uma API REST com Express · A REST API with Express

Aula 08 (12/11/2026) · solução de referência · reference solution

**PT** — O outro lado do `fetch`: uma API REST sobre o catálogo das Fichas 02–06, em **Node 22 + Express 5**. Um *array* em memória carregado de `data/items.json` é a "base de dados" (morre no *restart* — o M2 troca-o pelo MongoDB na Aula 10); o `catalog.js` da Ficha 02 é importado **sem alterações** por uma rota (`?q=`). Cinco rotas CRUD num `Router()` montado em `/api/items`, `express.json()` para o corpo, validação **no servidor** com as regras do `ItemForm.vue`, códigos 200/201/204/400/404, um *logger* e um 404 em JSON como *middlewares*. O cliente Vue não muda nesta ficha (Aula 11).
**EN** — The other side of `fetch`: a REST API over the catalog from Fichas 02–06, in **Node 22 + Express 5**. An in-memory array loaded from `data/items.json` is the "database" (it dies on restart — M2 swaps it for MongoDB in Aula 10); Ficha 02's `catalog.js` is imported **unchanged** by a route (`?q=`). Five CRUD routes in a `Router()` mounted at `/api/items`, `express.json()` for the body, **server-side** validation with `ItemForm.vue`'s rules, status codes 200/201/204/400/404, a logger and a JSON 404 as middlewares. The Vue client does not change in this ficha (Aula 11).

```sh
npm install
npm run dev          # http://localhost:3000 — try /api/health, /api/items?q=puzzle, /api/items/3, /api/items/999
node check.mjs       # noutro terminal, com o servidor a correr; silêncio = tudo bem · in another terminal; silence = all good
```

```sh
curl -i http://localhost:3000/api/items/3
curl -i -X POST http://localhost:3000/api/items -H 'Content-Type: application/json' \
  -d '{"name":"Chess","price":19.9,"category":"game"}'
curl -i -X DELETE http://localhost:3000/api/items/9
```

## Estrutura · Structure

| Ficheiro · File | Papel · Role |
|---|---|
| `src/app.js` | a aplicação: *logger* → `express.json()` → `/api/health` + `/api/items` → 404 em JSON → *handler* de erros; `listen(3000)` · the app: the middleware queue, the routers, the listening server |
| `src/items/router.js` | o recurso `/api/items`: GET `/` (`?q=`, e `?page=&limit=` — bónus A), GET `/:id`, POST (400/201 + `Location`), PUT, PATCH (bónus D), DELETE (204); `validate()` com as regras do formulário; o *array* carregado uma vez · the resource, five CRUD routes + PATCH |
| `src/catalog.js` | o da Ficha 02 (+ `sortByPrice` da Ficha 03), **sem alterações** — terceiro consumidor (CLI, Vue, Express) · Ficha 02's, unchanged |
| `data/items.json` | os dados da Ficha 05/06 · the catalog data |
| `check.mjs` | o cliente da API em `fetch` + `node:assert` — todas as rotas, os estados, a paginação, o 404 em JSON · the API's client in `fetch` + `node:assert` |

## O que se verifica · What to check

1. **Quem decide o estado é o servidor**: `res.status(404).json(...)`, `201`, `204`, `400` — o `fetch` do cliente só lê. · The server chooses the status; the client only reads it.
2. `req.params.id` e `req.query.*` são **strings** → `Number()` antes de comparar. · Params and query values are strings.
3. `express.json()` **antes** das rotas; sem `Content-Type: application/json` o corpo não é lido (`req.body` é `undefined` → `?? {}`). · The parser goes before the routes; without the header the body is ignored.
4. **Nunca confiar no corpo**: as regras do `ItemForm.vue` repetidas no servidor; o `id` vem do servidor (POST) ou do URL (PUT/PATCH), nunca do corpo. · Never trust the body; the id is never the client's.
5. `return` depois de responder — um *handler* que responde duas vezes rebenta. · Return after sending.
6. A ordem dos `app.use` é a ordem da fila: *logger* primeiro, 404 no fim, *handler* de erros (4 argumentos) mesmo no fim. · Middleware order is execution order.
7. Um `Router()` tem caminhos **relativos** ao sítio onde é montado. · Router paths are relative to the mount point.
8. O *array* é memória: cria, reinicia, desapareceu — como o `create()` local do M1. · The array is memory; M2 persists.

## Bónus incluídos · Bonuses included

- **A** — `?page=&limit=` → `{ count, page, pages, results }` (formato PokéAPI); `?page=99` → 404. · pagination.
- **D** — `PATCH` parcial ao lado do `PUT` completo; `Location` no 201. · partial PATCH, `Location` header.
- *(B — ligar o catálogo da Ficha 06 por `server.proxy` do Vite — é a Aula 11; C — `writeFile` em cada alteração — não incluído: ver a pergunta de reflexão 3.) · B is Aula 11; C not included.*

## Erros comuns · Common mistakes

- `import express from 'express'` sem `"type": "module"` → *Cannot use import statement outside a module*. · Missing `"type": "module"`.
- `readFile('data/items.json')` relativo à pasta onde se corre o `node` → ENOENT; usar `new URL('../../data/items.json', import.meta.url)`. · Paths relative to the file, not the cwd.
- `req.body` `undefined` → `express.json()` em falta ou **depois** da rota, ou `curl` sem `-H 'Content-Type: application/json'`. · Parser missing/misplaced, or no header.
- Falta o `return` antes do `res.status(404)` → *Cannot set headers after they are sent*. · Missing `return`.
- Rotas dentro do `Router` escritas como `/api/items/:id` → 404 (são relativas ao `app.use`). · Router paths are relative.
- `EADDRINUSE: :3000` → outro servidor ainda a correr noutro terminal. · Another server still running.
- Testar um `POST` na barra de endereço do browser (é um GET). · The address bar only does GET.

Dependências: Express 5.3; Node 22 (`node --watch`, `fetch` global). · Dependencies: Express 5.3; Node 22.
