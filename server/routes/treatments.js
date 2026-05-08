import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllTreatments, getTreatmentById, createTreatment, updateTreatment, deleteTreatment } from '../db/queries.js'

const router = Router()

// GET /api/treatments?dog_id=1
router.get('/', async (req, res) => {
  const { dog_id } = req.query
  try { res.json(await getAllTreatments({ dog_id: dog_id ? Number(dog_id) : undefined })) }
  catch (err) { console.error('[GET /treatments]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const t = await getTreatmentById(id)
    if (!t) return res.status(404).json({ error: 'Tratamento não encontrado' })
    res.json(t)
  } catch (err) { console.error('[GET /treatments/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { dog_id, conditions_id, actions } = req.body
  if (!dog_id || !conditions_id)
    return res.status(400).json({ error: 'dog_id e conditions_id são obrigatórios' })
  try {
    const id = await createTreatment({ dog_id, conditions_id, actions })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /treatments]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { actions } = req.body
  try {
    const affected = await updateTreatment(id, { actions })
    if (!affected) return res.status(404).json({ error: 'Tratamento não encontrado' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /treatments/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteTreatment(id)
//     if (!affected) return res.status(404).json({ error: 'Tratamento não encontrado' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /treatments/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
