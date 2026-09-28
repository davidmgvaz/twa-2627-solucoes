import { writeFile } from 'node:fs/promises'

// 1. Fetch — top-level await works because package.json has "type": "module"
const res = await fetch('https://api.github.com/repos/nodejs/node')
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const repo = await res.json()

console.log(repo.name, repo.stargazers_count)

// 2. Keep only the fields we care about (the API returns ~100)
const summary = {
  name: repo.full_name,
  description: repo.description,
  stars: repo.stargazers_count,
  forks: repo.forks_count,
  language: repo.language,
  license: repo.license?.spdx_id ?? null,
  updatedAt: repo.updated_at,
  url: repo.html_url,
}

// 3. Save them — JSON.stringify(value, null, 2) pretty-prints with 2 spaces
await writeFile('repo.json', JSON.stringify(summary, null, 2) + '\n')
console.log('saved repo.json')
