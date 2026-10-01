# Ficha 02 — Módulo de catálogo · Catalog module

Aula 02 (01/10/2026) · solução de referência · reference solution

**PT** — Um módulo de dados (`data.js`), um módulo de lógica só com funções puras (`catalog.js`) e um ponto de entrada que faz todo o I/O (`app.js`). É a estrutura que vai ser reutilizada no projeto: a mesma lógica servida por uma rota Express e importada por um componente Vue.
**EN** — A data module (`data.js`), a logic module with pure functions only (`catalog.js`) and an entry point that does all the I/O (`app.js`). This is the structure the project reuses: the same logic served by an Express route and imported by a Vue component.

```sh
node app.js                 # lista tudo · list everything
node app.js book            # uma categoria · one category
node app.js search puzzle   # nome ou tags · name or tags (case-insensitive)
node app.js top 3           # os 3 mais caros · 3 most expensive
node app.js report          # escreve · writes report.json
node check.js               # asserções; silêncio = tudo bem · assertions; silence = all good
```

Sem dependências; Node 22 (`toSorted`, `Object.groupBy`, `structuredClone`). · No dependencies; Node 22.

## O que se verifica · What to check

1. `catalog.js` não tem `console.log`, `for`/`while` nem acesso a ficheiros · has no `console.log`, `for`/`while` or file access.
2. `search` procura no nome **e** nas tags, sem distinguir maiúsculas · searches name **and** tags, case-insensitive.
3. `top` e `withDiscount` devolvem arrays/objetos novos; `check.js` prova que `items` não mudou · return new arrays/objects; `check.js` proves `items` is unchanged.
4. `report.json` é escrito com `writeFile` de `node:fs/promises` (o passo mais saltado na Ficha 01) · is written with `writeFile` from `node:fs/promises` (the most-skipped step of Ficha 01).
5. `data.js` tem ≥ 8 itens com `id`, `name`, `category`, `price`, `tags` e um objeto aninhado · has ≥ 8 items with those fields and one nested object.

## Erros comuns · Common mistakes

- `sort()` sem comparador ordena como strings (`[10, 9, 1]` → `[1, 10, 9]`) · without a comparator sorts as strings.
- `withDiscount` a alterar o item original em vez de `{ ...item, price }` · mutating the original item instead of spreading.
- `search` só no nome, ou `includes` sem `toLowerCase()` · only on the name, or `includes` without `toLowerCase()`.
- `reduce` sem valor inicial: rebenta com uma lista vazia · without an initial value: crashes on an empty list.
