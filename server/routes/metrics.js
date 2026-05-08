import { Router } from 'express'
import { parseId } from '../utils.js'
import { getTodayMetrics, getWeekMetrics, getLatestDogStatus } from '../db/queries.js'

// Mounted at /api/dogs
const router = Router()

router.get('/:id/metrics/today', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const metrics = await getTodayMetrics(id)
    if (!metrics) return res.status(404).json({ error: 'Sem dados para hoje' })
    res.json(metrics)
  } catch (err) {
    console.error('[GET /dogs/:id/metrics/today]', err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.get('/:id/metrics/week', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const metrics = await getWeekMetrics(id)
    res.json(metrics)
  } catch (err) {
    console.error('[GET /dogs/:id/metrics/week]', err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// One-shot status snapshot
router.get('/:id/status', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const status = await getLatestDogStatus(id)
    if (!status) return res.status(404).json({ error: 'Sem leituras de coleira' })
    res.json(status)
  } catch (err) {
    console.error('[GET /dogs/:id/status]', err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

// SSE — streams latest collar_log state every 5 s
router.get('/:id/status/stream', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).end()

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  const send = async () => {
    try {
      const status = await getLatestDogStatus(id)
      res.write(`data: ${JSON.stringify(status)}\n\n`)
    } catch (err) {
      console.error('[SSE /dogs/:id/status/stream]', err)
      res.write(`event: error\ndata: ${JSON.stringify({ error: 'Erro interno' })}\n\n`)
    }
  }

  await send()
  const interval = setInterval(send, 5000)
  req.on('close', () => clearInterval(interval))
})

export default router
