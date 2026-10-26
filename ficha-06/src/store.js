// store.js — estado FORA de qualquer componente. Um módulo ES é avaliado uma vez e partilhado por quem o importa
// (Aula 02), logo estes refs são globais e reativos: sobrevivem à navegação entre páginas (morrem no reload — o M2
// persiste no servidor). É o Pinia em 20 linhas; não usa useLoad porque o onMounted lá dentro precisa de um componente.
// State OUTSIDE any component. An ES module is evaluated once and shared by every importer (Aula 02), so these refs
// are global and reactive: they survive navigation between pages (they die on reload — M2 persists them on the server).
// This is Pinia in 20 lines; it doesn't use useLoad because the onMounted inside it needs a component.
import { ref } from 'vue'
import { getJSON } from './api/getJSON.js'

export const items = ref(null) // null until the first load resolves · null até o primeiro load resolver
export const status = ref('idle') // 'idle' | 'loading' | 'error' | 'ready'
export const error = ref(null)

export async function load() {
  status.value = 'loading'
  error.value = null
  try {
    items.value = await getJSON('/items.json')
    status.value = 'ready'
  } catch (err) {
    status.value = 'error'
    error.value = err.message
  }
}

// pages call this on mount: load once, not on every visit · as páginas chamam isto ao montar: carrega uma vez
export function ensureLoaded() {
  if (items.value === null && status.value !== 'loading') load()
}

const nextId = () => Math.max(0, ...items.value.map((i) => i.id)) + 1

// the only place `items` changes · o único sítio onde `items` muda (M2: POST /api/items)
export function addItem(item) {
  const id = nextId()
  items.value.push({ id, ...item })
  return id
}

export function updateItem(item) { // bonus A · bónus A (M2: PUT /api/items/:id)
  const i = items.value.findIndex((x) => x.id === item.id)
  if (i !== -1) items.value[i] = item
}
