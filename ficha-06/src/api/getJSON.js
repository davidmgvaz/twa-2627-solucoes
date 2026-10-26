// getJSON — o fetch das Fichas 01–04: res.ok + JSON, lança em caso de erro. É o mesmo ficheiro do template do projeto.
// The fetch from Fichas 01–04: res.ok + JSON, throws on error. Same file as in the project template.
export async function getJSON(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`HTTP ${res.status} — ${url}`)
  return res.json() // throws "Unexpected token '<'" if Vite answered with index.html
}
