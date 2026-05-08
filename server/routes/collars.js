import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllCollars, getCollarById, createCollar, updateCollar, deleteCollar, getCollarStats, getCollarHourlyActivity } from '../db/queries.js'

const router = Router()

router.get('/', async (_req, res) => {
  try { res.json(await getAllCollars()) }
  catch (err) { console.error('[GET /collars]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id/activity', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try { res.json(await getCollarHourlyActivity(id)) }
  catch (err) { console.error('[GET /collars/:id/activity]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id/stats', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const stats = await getCollarStats(id)
    if (!stats.total) return res.status(404).json({ error: 'Sem leituras para esta coleira' })
    res.json(stats)
  } catch (err) { console.error('[GET /collars/:id/stats]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const collar = await getCollarById(id)
    if (!collar) return res.status(404).json({ error: 'Coleira não encontrada' })
    res.json(collar)
  } catch (err) { console.error('[GET /collars/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { user_id, date_of_purchase } = req.body
  if (!user_id) return res.status(400).json({ error: 'user_id é obrigatório' })
  try {
    const id = await createCollar({ user_id, date_of_purchase })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /collars]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { date_of_purchase } = req.body
  try {
    const affected = await updateCollar(id, { date_of_purchase })
    if (!affected) return res.status(404).json({ error: 'Coleira não encontrada' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /collars/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteCollar(id)
//     if (!affected) return res.status(404).json({ error: 'Coleira não encontrada' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /collars/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
