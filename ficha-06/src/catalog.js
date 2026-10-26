// catalog.js — funções puras sobre uma lista de itens · pure functions over a list of items.
// Copiado da Ficha 02 sem alterações, mais sortByPrice (passo 3 da Ficha 03).
// Copied from Ficha 02 unchanged, plus sortByPrice (Ficha 03, step 3).
// Sem I/O, sem console.log, sem ciclos. · No I/O, no console.log, no loops.

export const byCategory = (list, cat) =>
  list.filter((item) => item.category === cat)

// nome OU tags, sem distinguir maiúsculas · name OR tags, case-insensitive
export const search = (list, text) => {
  const needle = text.toLowerCase()
  return list.filter(({ name, tags }) =>
    [name, ...tags].some((t) => t.toLowerCase().includes(needle)))
}

export const total = (list) =>
  list.reduce((sum, { price }) => sum + price, 0)

// os n mais caros, array novo, do mais caro para o mais barato · n most expensive, new array, desc
export const top = (list, n) =>
  list.toSorted((a, b) => b.price - a.price).slice(0, n)

// categorias únicas, ordenadas · unique categories, sorted
export const categories = (list) =>
  [...new Set(list.map((item) => item.category))].toSorted()

// itens NOVOS com desconto; os originais não mudam · NEW items with a discount; originals untouched
export const withDiscount = (list, pct) =>
  list.map((item) => ({ ...item, price: round2(item.price * (1 - pct / 100)) }))

// Ficha 03 · nova: array novo ordenado por preço, 'asc' ou 'desc' · new: new array sorted by price
export const sortByPrice = (list, dir = 'desc') =>
  list.toSorted((a, b) => (dir === 'asc' ? a.price - b.price : b.price - a.price))

// bónus · bonus
export const groupByCategory = (list) => Object.groupBy(list, (item) => item.category)

const round2 = (n) => Math.round(n * 100) / 100
