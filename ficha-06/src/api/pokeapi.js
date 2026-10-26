// api/pokeapi.js — como se fala com a PokéAPI. Os URLs vivem aqui, só aqui; a página pede "a página 3" e este
// ficheiro traduz para offset/limit. Mudar de API = mudar este ficheiro (no M2: BASE = '/api').
// How we talk to the PokéAPI. URLs live here, only here; the page asks for "page 3" and this file translates it
// into offset/limit. Changing API = changing this file (in M2: BASE = '/api').
import { getJSON } from './getJSON.js'

const BASE = 'https://pokeapi.co/api/v2'
export const PAGE = 20

// → { count, next, previous, results: [{ name, url }] }
export const list = (page = 1) => getJSON(`${BASE}/pokemon?limit=${PAGE}&offset=${(page - 1) * PAGE}`)

// → the full Pokémon object (id, name, height, weight, types, sprites…)
export const get = (name) => getJSON(`${BASE}/pokemon/${name}`)
