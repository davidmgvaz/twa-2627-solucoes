# Ficha 01 — Ambiente e primeiros módulos · Environment and first modules

Aula 01 (24/09/2026) · solução de referência · reference solution

**PT** — Os alunos entregaram um repositório `twa-<nome>` com estas duas pastas. Não é a única resposta certa: comparem com o vosso código.
**EN** — Students submitted a `twa-<yourname>` repository with these two folders. Not the only correct answer: compare it with your own code.

| Pasta · Folder | Passo · Step | O que mostra · What it shows |
|---|---|---|
| `twa-ficha01/` | 2–3 + bónus · bonus | módulos ES, `await` de topo, `fetch`, gravar JSON com `fs/promises`, ler XML · ES modules, top-level `await`, `fetch`, saving JSON with `fs/promises`, reading XML |
| `twa-vite/` | 4 | projeto Vite *vanilla*; o contador conta **para baixo** e mostra o valor no título do separador · Vite vanilla project; the counter counts **down** and shows the value in the tab title |

## Requisitos · Requirements

Node.js 22 LTS (`node --version` → `v22.x`), npm 10, Git.

## twa-ficha01 — primeiros módulos ES · first ES modules

```sh
cd twa-ficha01
node app.js     # tecnologias-web-avançadas
node api.js     # node <stars>  ·  saved repo.json
node rss.js     # 3 últimas releases do Node.js (Atom) · latest Node.js releases; ou · or: node rss.js <RSS URL>
```

Sem dependências — tudo o que se usa (`fetch`, `node:fs/promises`) vem com o Node 22. · No dependencies — everything used is built into Node 22.

- **PT** — `package.json` tem `"type": "module"`: sem isso, `import` falha com *Cannot use import statement outside a module* e o `await` de topo não é permitido. `api.js` guarda 8 dos ~100 campos que o GitHub devolve e escreve-os em `repo.json` com `writeFile` de `node:fs/promises`; o `repo.json` é um resultado do script e está aqui só como exemplo do esperado.
- **EN** — `package.json` has `"type": "module"`: without it, `import` fails with *Cannot use import statement outside a module* and top-level `await` isn't allowed. `api.js` keeps 8 of the ~100 fields GitHub returns and writes them to `repo.json` with `writeFile` from `node:fs/promises`; `repo.json` is an output of the script and is committed only as an example of the expected result.

## twa-vite — um projeto Vite · a Vite project

```sh
cd twa-vite
npm install
npm run dev     # http://localhost:5173
```

Criado com · created with `npm create vite@latest twa-vite -- --template vanilla`; o único ficheiro alterado é · the only file changed is `src/counter.js`.

## O que se verifica · What to check

1. `package.json` com `"type": "module"`; `import`/`export`, sem `require` · with `"type": "module"`; `import`/`export`, no `require`.
2. `api.js` trata uma resposta falhada (`res.ok`) e produz um `repo.json` com alguns campos escolhidos, não a resposta inteira · handles a failed response (`res.ok`) and produces a `repo.json` with a handful of chosen fields, not the whole response.
3. O contador começa num valor, desce a cada clique e o título do separador acompanha · the counter starts at some value, goes down on each click, and the tab title follows it.
4. `node_modules/` **não** está no repositório (`.gitignore` na raiz) · is **not** in the repository (`.gitignore` at the root).
