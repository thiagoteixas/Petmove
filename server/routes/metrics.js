import { Router } from 'express'
import { getTodayMetrics, getWeekMetrics } from '../db/queries.js'

const router = Router()

function parseId(raw) {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

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

export default router
