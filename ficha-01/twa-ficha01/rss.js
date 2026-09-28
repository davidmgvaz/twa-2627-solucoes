// Done early? — an API that answers XML instead of JSON.
//   node rss.js                                   → Node.js releases (Atom feed)
//   node rss.js https://www.publico.pt/rss        → any RSS feed
//
// RSS wraps each post in <item>, Atom in <entry>; both have a <title>.
// Node has no DOMParser, so for a three-line exercise a regular expression is enough.
// In a real project use a parser (e.g. fast-xml-parser): regex on XML breaks easily.
const url = process.argv[2] ?? 'https://github.com/nodejs/node/releases.atom'

const res = await fetch(url)
if (!res.ok) throw new Error(`HTTP ${res.status}`)
const xml = await res.text()

const posts = xml.match(/<(item|entry)[\s>][\s\S]*?<\/\1>/g) ?? []
const titles = posts
  .slice(0, 3)
  .map((post) => post.match(/<title[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/title>/)?.[1].trim())
  .map(decodeEntities)

titles.forEach((title, i) => console.log(`${i + 1}. ${title}`))

// XML escapes some characters (&amp; &lt; &#39; …); turn the common ones back into text.
function decodeEntities(text = '') {
  const named = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'" }
  return text.replace(/&(#x?[0-9a-f]+|\w+);/gi, (match, code) => {
    if (code[0] !== '#') return named[code] ?? match
    const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : Number(code.slice(1))
    return String.fromCodePoint(n)
  })
}
