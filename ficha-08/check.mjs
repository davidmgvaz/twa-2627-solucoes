// check.mjs — o cliente da API é o fetch que já conheces; silêncio = tudo bem (o padrão do check.js desde a Ficha 02).
// The API's client is the fetch you already know; prints nothing when everything passes.
// Correr com o servidor a trabalhar noutro terminal: npm run dev · node check.mjs
// Run with the server up in another terminal.
import assert from 'node:assert/strict'

const BASE = process.env.BASE ?? 'http://localhost:3000/api'
const json = { 'Content-Type': 'application/json' }
const post = (body, headers = json) =>
  fetch(`${BASE}/items`, { method: 'POST', headers, body: JSON.stringify(body) })

// Parte 1 — GET
let res = await fetch(`${BASE}/health`)
assert.equal(res.status, 200)
assert.equal((await res.json()).ok, true)

res = await fetch(`${BASE}/items`)
assert.equal(res.status, 200)
assert.match(res.headers.get('content-type'), /application\/json/)
const all = await res.json()
assert.ok(Array.isArray(all) && all.length >= 8)

res = await fetch(`${BASE}/items?q=puzzle`)
assert.deepEqual((await res.json()).map((i) => i.id), [5, 6])

res = await fetch(`${BASE}/items/3`)
assert.equal((await res.json()).id, 3)

res = await fetch(`${BASE}/items/999`)
assert.equal(res.status, 404)
assert.ok((await res.json()).error)                       // JSON, não HTML · JSON, not HTML

// Parte 2 — POST
res = await post({ name: 'ab', price: -1 })
assert.equal(res.status, 400)
assert.deepEqual(Object.keys((await res.json()).errors).sort(), ['name', 'price'])

res = await post({ name: 'Chess', price: 19.9 }, {})        // sem Content-Type → corpo ignorado · no header → body ignored
assert.equal(res.status, 400)

res = await post({ name: '  Chess ', price: 19.9, category: 'game', id: 1 })
assert.equal(res.status, 201)
const created = await res.json()
assert.equal(created.name, 'Chess')                        // trim
assert.ok(created.id > 8, 'the server chooses the id')     // o cliente não escolhe o id
assert.deepEqual(created.tags, [])                         // tags por omissão · default tags
assert.equal(res.headers.get('location'), `/api/items/${created.id}`)   // bónus D

res = await fetch(`${BASE}/items/${created.id}`)
assert.equal((await res.json()).name, 'Chess')

res = await fetch(`${BASE}/items?q=chess`)                 // o item criado também entra na pesquisa · searchable
assert.equal((await res.json()).length, 1)

// Parte 3 — PUT · PATCH · DELETE
res = await fetch(`${BASE}/items/${created.id}`, {
  method: 'PUT', headers: json, body: JSON.stringify({ name: 'Chess set', price: 24.5, category: 'game', id: 42 }),
})
assert.equal(res.status, 200)
assert.equal((await res.json()).id, created.id)            // o id é o do URL · id from the URL

res = await fetch(`${BASE}/items/${created.id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ price: 20 }) })
let item = await res.json()
assert.equal(item.price, 20)
assert.equal(item.name, 'Chess set')                       // o resto ficou · the rest stayed

res = await fetch(`${BASE}/items/${created.id}`, { method: 'PATCH', headers: json, body: JSON.stringify({ price: 'x' }) })
assert.equal(res.status, 400)

res = await fetch(`${BASE}/items/${created.id}`, { method: 'DELETE' })
assert.equal(res.status, 204)
assert.equal(await res.text(), '')                          // sem corpo · no body

res = await fetch(`${BASE}/items/${created.id}`)
assert.equal(res.status, 404)

res = await fetch(`${BASE}/items/${created.id}`, { method: 'DELETE' })
assert.equal(res.status, 404)

// middleware: 404 em JSON para qualquer caminho · JSON 404 for any path
res = await fetch(`${BASE}/nothing`)
assert.equal(res.status, 404)
assert.ok((await res.json()).error)

// JSON mal formado no corpo → 400 (handler de erros) · malformed JSON → 400 (error handler)
res = await fetch(`${BASE}/items`, { method: 'POST', headers: json, body: '{ oops' })
assert.equal(res.status, 400)

// Bónus A — paginação · pagination
res = await fetch(`${BASE}/items?page=2&limit=3`)
let page = await res.json()
assert.equal(page.count, all.length)
assert.equal(page.results.length, 3)
assert.equal(page.results[0].id, all[3].id)
res = await fetch(`${BASE}/items?page=99`)
assert.equal(res.status, 404)

// o array continua como no início (criámos e apagámos) · the array is back to the start
res = await fetch(`${BASE}/items`)
assert.equal((await res.json()).length, all.length)
