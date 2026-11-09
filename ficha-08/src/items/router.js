// items/router.js — o recurso /api/items: cinco rotas CRUD sobre um array em memória (+ PATCH, bónus D).
// The /api/items resource: five CRUD routes over an in-memory array (+ PATCH, bonus D).
// Os caminhos são relativos ao sítio onde o router é montado (app.use('/api/items', router)).
// Paths are relative to the mount point.
import { readFile } from 'node:fs/promises'
import { Router } from 'express'
import { search } from '../catalog.js'   // Ficha 02 — terceiro consumidor · third consumer

// a "base de dados": carregada UMA vez, morre no restart (o M2 troca isto pelo MongoDB, Aula 10)
// the "database": loaded ONCE, dies on restart (M2 swaps this for MongoDB, Aula 10)
const items = JSON.parse(
  await readFile(new URL('../../data/items.json', import.meta.url), 'utf8'))

const PAGE = 20                                            // bónus A · bonus A
const nextId = () => Math.max(0, ...items.map((i) => i.id)) + 1
const find = (id) => items.findIndex((i) => i.id === Number(id))

// as regras do ItemForm.vue (Ficha 05), repetidas no servidor: o browser é uma cortesia, isto é a segurança
// ItemForm.vue's rules (Ficha 05), repeated on the server: the browser is a courtesy, this is the security
function validate(body, { partial = false } = {}) {
  const errors = {}
  const { name, price, category } = body
  if (!partial || name !== undefined) {
    if (typeof name !== 'string' || name.trim().length < 3) errors.name = 'at least 3 characters'
  }
  if (!partial || price !== undefined) {
    if (typeof price !== 'number' || !(price > 0)) errors.price = 'must be a number > 0'
  }
  if (category !== undefined && typeof category !== 'string') errors.category = 'must be a string'
  return errors
}

const router = Router()

// GET /api/items?q=puzzle&page=2&limit=3
//   sem page/limit → o array (filtrado); com page → { count, results } como a PokéAPI (bónus A)
//   without page/limit → the (filtered) array; with page → { count, results } like the PokéAPI (bonus A)
router.get('/', (req, res) => {
  const { q, page, limit } = req.query               // tudo string ou undefined · all strings or undefined
  const list = q ? search(items, q) : items
  if (page === undefined && limit === undefined) return res.json(list)

  const size = Math.min(Number(limit) || PAGE, 100)
  const p = Number(page) || 1
  const pages = Math.max(1, Math.ceil(list.length / size))
  if (p < 1 || p > pages) return res.status(404).json({ error: `page ${p} of ${pages}` })
  res.json({ count: list.length, page: p, pages, results: list.slice((p - 1) * size, p * size) })
})

// GET /api/items/:id — req.params.id é uma string → Number() · params are strings
router.get('/:id', (req, res) => {
  const i = find(req.params.id)
  if (i === -1) return res.status(404).json({ error: `item ${req.params.id} not found` })
  res.json(items[i])
})

// POST /api/items — 400 { errors } ou 201 + o item criado (+ Location, bónus D) · 400 or 201 + the item
router.post('/', (req, res) => {
  const body = req.body ?? {}                         // sem Content-Type JSON, req.body é undefined · no JSON header → undefined
  const errors = validate(body)
  if (Object.keys(errors).length) return res.status(400).json({ errors })

  const item = { category: 'misc', tags: [], ...body, id: nextId(), name: body.name.trim() }
  items.push(item)                                    // o id vem depois do spread: o cliente não o escolhe · client can't pick the id
  res.status(201).location(`/api/items/${item.id}`).json(item)
})

// PUT /api/items/:id — substitui tudo; o id é o do URL · replaces everything; id from the URL
router.put('/:id', (req, res) => {
  const i = find(req.params.id)
  if (i === -1) return res.status(404).json({ error: 'not found' })
  const body = req.body ?? {}
  const errors = validate(body)
  if (Object.keys(errors).length) return res.status(400).json({ errors })
  items[i] = { category: 'misc', tags: [], ...body, id: items[i].id, name: body.name.trim() }
  res.json(items[i])
})

// PATCH /api/items/:id — altera só os campos enviados (bónus D) · changes only the fields sent (bonus D)
router.patch('/:id', (req, res) => {
  const i = find(req.params.id)
  if (i === -1) return res.status(404).json({ error: 'not found' })
  const body = req.body ?? {}
  const errors = validate(body, { partial: true })
  if (Object.keys(errors).length) return res.status(400).json({ errors })
  items[i] = { ...items[i], ...body, id: items[i].id }
  res.json(items[i])
})

// DELETE /api/items/:id — 204 sem corpo (end(), não json()) · 204, no body
router.delete('/:id', (req, res) => {
  const i = find(req.params.id)
  if (i === -1) return res.status(404).json({ error: 'not found' })
  items.splice(i, 1)
  res.status(204).end()
})

export default router
