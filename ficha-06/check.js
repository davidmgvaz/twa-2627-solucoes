// check.js — asserções sobre catalog.js (o da Ficha 02 + sortByPrice); silêncio = tudo bem.
// Assertions over catalog.js (Ficha 02's + sortByPrice); prints nothing when everything passes.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { byCategory, categories, search, sortByPrice, top, total, withDiscount } from './src/catalog.js'

// the same data the page fetches — produced from Ficha 02's data.js (see README)
const items = JSON.parse(await readFile(new URL('./public/items.json', import.meta.url), 'utf8'))

assert.equal(items.length >= 8, true)
assert.equal(byCategory(items, 'game').length, 3)
assert.deepEqual(search(items, 'PUZZLE').map((i) => i.id), [5, 6])
assert.equal(total([{ price: 2 }, { price: 3.5 }]), 5.5)
assert.deepEqual(top(items, 2).map((i) => i.id), [7, 4])
assert.deepEqual(categories(items), ['book', 'game', 'tool'])

const before = structuredClone(items)
assert.equal(withDiscount(items, 10)[0].price, 29.25)
assert.deepEqual(items, before)

// Ficha 03: sortByPrice — new array, both directions, originals untouched
const desc = sortByPrice(items, 'desc')
const asc = sortByPrice(items, 'asc')
assert.deepEqual(desc.slice(0, 2).map((i) => i.id), [7, 4])
assert.equal(asc[0].id, 5)
assert.equal(asc.at(-1).id, 7)
assert.deepEqual(sortByPrice([{ price: 9 }, { price: 10 }, { price: 100 }]).map((i) => i.price), [100, 10, 9]) // numeric, not string
assert.notEqual(desc, items)
assert.deepEqual(items, before)
