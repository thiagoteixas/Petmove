import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllCollarLogs, getCollarLogById, createCollarLog, updateCollarLog, deleteCollarLog } from '../db/queries.js'

const router = Router()

// GET /api/collar-logs?collar_id=1&limit=100
router.get('/', async (req, res) => {
  const { collar_id, limit } = req.query
  try { res.json(await getAllCollarLogs({ collar_id: collar_id ? Number(collar_id) : undefined, limit })) }
  catch (err) { console.error('[GET /collar-logs]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const log = await getCollarLogById(id)
    if (!log) return res.status(404).json({ error: 'Log não encontrado' })
    res.json(log)
  } catch (err) { console.error('[GET /collar-logs/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { collar_id, state, magnitude, x_axis, y_axis, z_axis, battery } = req.body
  if (!collar_id) return res.status(400).json({ error: 'collar_id é obrigatório' })
  try {
    const id = await createCollarLog({ collar_id, state, magnitude, x_axis, y_axis, z_axis, battery })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /collar-logs]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { state, magnitude, x_axis, y_axis, z_axis, battery } = req.body
  try {
    const affected = await updateCollarLog(id, { state, magnitude, x_axis, y_axis, z_axis, battery })
    if (!affected) return res.status(404).json({ error: 'Log não encontrado' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /collar-logs/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteCollarLog(id)
//     if (!affected) return res.status(404).json({ error: 'Log não encontrado' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /collar-logs/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
