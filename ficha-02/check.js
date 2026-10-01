// check.js — uma asserção por função; não imprime nada quando passa tudo.
// One assertion per function; prints nothing when everything passes.
import assert from 'node:assert/strict'
import { items } from './data.js'
import { byCategory, categories, groupByCategory, search, top, total, withDiscount } from './catalog.js'

assert.equal(byCategory(items, 'game').length, 3)
assert.deepEqual(search(items, 'PUZZLE').map((i) => i.id), [5, 6])          // tag, case-insensitive
assert.deepEqual(search(items, 'clean').map((i) => i.id), [1])             // name
assert.equal(total([{ price: 2 }, { price: 3.5 }]), 5.5)
assert.deepEqual(top(items, 2).map((i) => i.id), [7, 4])
assert.deepEqual(categories(items), ['book', 'game', 'tool'])

const before = structuredClone(items)
const cheaper = withDiscount(items, 10)
assert.equal(cheaper[0].price, 29.25)
assert.deepEqual(items, before)                                             // originals untouched
assert.notEqual(cheaper[0], items[0])                                       // new objects, not the same references

assert.deepEqual(Object.keys(groupByCategory(items)).toSorted(), ['book', 'game', 'tool'])
