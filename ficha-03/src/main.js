// main.js — o único ficheiro que toca no DOM e fala com a rede. · The only file that touches the DOM and the network.
// Padrão render(state): os eventos só mudam o estado; uma função desenha a página a partir dele.
// render(state) pattern: events only change the state; one function draws the page from it.
import './style.css'
import { byCategory, categories, search, sortByPrice } from './catalog.js'

// --- state: tudo o que a página precisa para se desenhar · everything the page needs to draw itself
const state = {
  status: 'loading', // 'loading' | 'error' | 'ready'
  error: null,
  items: [],
  query: '',
  category: '',
  sortDir: 'desc',
  selectedId: null,
}

// --- DOM handles (static elements from index.html)
const $ = (sel) => document.querySelector(sel)
const q = $('#q')
const categorySelect = $('#category')
const sortButton = $('#sort')
const status = $('#status')
const list = $('#list')
const detail = $('#detail')

// helper: createElement + textContent — never innerHTML with data
const el = (tag, text, attrs = {}) => {
  const e = document.createElement(tag)
  if (text !== undefined) e.textContent = text
  Object.assign(e, attrs)
  return e
}

// --- load(): fetch + the three states
async function load(url = '/items.json') {
  state.status = 'loading'
  state.error = null
  render()
  try {
    const res = await fetch(url)
    if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
    state.items = await res.json() // throws "Unexpected token '<'" if Vite answered with index.html
    state.status = 'ready'
    fillCategories() // once, after the data is known
  } catch (err) {
    state.status = 'error'
    state.error = err.message
  } finally {
    render()
  }
}

function fillCategories() {
  categorySelect.replaceChildren(
    el('option', 'All', { value: '' }),
    ...categories(state.items).map((c) => el('option', c, { value: c })),
  )
}

// --- the visible items are a pure pipeline over the state
function visibleItems() {
  let items = search(state.items, state.query)
  if (state.category) items = byCategory(items, state.category)
  return sortByPrice(items, state.sortDir)
}

// --- render(): the ONE place that writes #status, #list and #detail
function render() {
  if (state.status === 'loading') {
    status.textContent = 'Loading…'
    list.replaceChildren()
    detail.replaceChildren()
    return
  }
  if (state.status === 'error') {
    const retry = el('button', 'Retry', { type: 'button' }) // bonus C
    retry.addEventListener('click', () => load())
    status.replaceChildren(el('span', `Error: ${state.error} `), retry)
    list.replaceChildren()
    detail.replaceChildren()
    return
  }

  const items = visibleItems()
  status.textContent = items.length
    ? `${items.length} item${items.length === 1 ? '' : 's'}`
    : `No results for "${state.query}"`
  sortButton.textContent = state.sortDir === 'desc' ? 'Price ↓' : 'Price ↑'

  list.replaceChildren(...items.map(toLi))

  const selected = state.items.find((i) => i.id === state.selectedId)
  detail.replaceChildren(...(selected ? toDetail(selected) : []))
}

function toLi(item) {
  const li = el('li', `${item.name} · ${item.price.toFixed(2)} €`)
  li.dataset.id = item.id // string! Number(...) when reading it back
  if (item.id === state.selectedId) li.classList.add('selected')
  return li
}

function toDetail(item) {
  const nested = Object.entries(item).find(([, v]) => v && typeof v === 'object' && !Array.isArray(v))
  const dl = el('dl')
  const row = (k, v) => dl.append(el('dt', k), el('dd', v))
  row('Category', item.category)
  row('Price', `${item.price.toFixed(2)} €`)
  row('Tags', item.tags.join(', '))
  if (nested) {
    const [key, obj] = nested
    Object.entries(obj).forEach(([k, v]) => row(`${key}.${k}`, String(v)))
  }
  return [el('h2', item.name), dl]
}

// --- events: change the state, then render. Never touch the DOM here.
q.addEventListener('input', (e) => {
  state.query = e.target.value
  render()
})
categorySelect.addEventListener('change', (e) => {
  state.category = e.target.value
  render()
})
sortButton.addEventListener('click', () => {
  state.sortDir = state.sortDir === 'desc' ? 'asc' : 'desc'
  render()
})
// bonus B — event delegation: one listener on the <ul>, works for <li>s created later by render()
list.addEventListener('click', (e) => {
  const li = e.target.closest('li[data-id]')
  if (!li) return
  state.selectedId = Number(li.dataset.id)
  render()
})
$('#controls').addEventListener('submit', (e) => e.preventDefault()) // Enter in the search box must not reload

load()
