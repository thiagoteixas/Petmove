import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllInsights, getInsightById, createInsight, updateInsight, deleteInsight } from '../db/queries.js'

const router = Router()

// GET /api/daily-insights?dog_id=1&days=30
router.get('/', async (req, res) => {
  const { dog_id, days } = req.query
  try { res.json(await getAllInsights({ dog_id: dog_id ? Number(dog_id) : undefined, days })) }
  catch (err) { console.error('[GET /daily-insights]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const insight = await getInsightById(id)
    if (!insight) return res.status(404).json({ error: 'Insight não encontrado' })
    res.json(insight)
  } catch (err) { console.error('[GET /daily-insights/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { dog_id, date, diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off } = req.body
  if (!dog_id || !date) return res.status(400).json({ error: 'dog_id e date são obrigatórios' })
  try {
    const id = await createInsight({ dog_id, date, diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /daily-insights]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off } = req.body
  try {
    const affected = await updateInsight(id, { diagnosis, total_calories, active_seconds, time_stalled, time_walking, time_running, time_off })
    if (!affected) return res.status(404).json({ error: 'Insight não encontrado' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /daily-insights/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteInsight(id)
//     if (!affected) return res.status(404).json({ error: 'Insight não encontrado' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /daily-insights/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
