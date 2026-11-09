// app.js — a aplicação Express: a fila de middlewares, um Router por recurso, o servidor à escuta.
// The Express app: the middleware queue, one Router per resource, the listening server.
import express from 'express'
import itemsRouter from './items/router.js'

const app = express()
const PORT = process.env.PORT ?? 3000   // Aula 09: .env

// 1. logger — corre em TODOS os pedidos; next() passa ao seguinte · runs on every request
app.use((req, res, next) => {
  console.log(new Date().toISOString().slice(11, 19), req.method, req.url)
  next()
})

// 2. parser — lê corpos JSON (Content-Type: application/json) para req.body · JSON bodies → req.body
app.use(express.json())

// 3. rotas · routes
app.get('/api/health', (req, res) => {
  res.json({ ok: true, time: new Date() })
})
app.use('/api/items', itemsRouter)

// 4. 404 — só chega aqui o que ninguém respondeu; em JSON, nunca HTML · only unanswered requests get here
app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.url}` })
})

// 5. erros — um handler que lança (ou JSON mal formado no corpo) cai aqui; Express 5 passa também os async
//    errors — a throwing handler (or malformed JSON in the body) lands here; Express 5 forwards async throws too
app.use((err, req, res, next) => {
  const status = err.status ?? 500          // express.json() lança err.status = 400 para JSON inválido
  if (status === 500) console.error(err)
  res.status(status).json({ error: status === 500 ? 'internal error' : err.message })
})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`))
