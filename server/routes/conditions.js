import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllConditions, getConditionById, createCondition, updateCondition, deleteCondition } from '../db/queries.js'

const router = Router()

router.get('/', async (_req, res) => {
  try { res.json(await getAllConditions()) }
  catch (err) { console.error('[GET /conditions]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const condition = await getConditionById(id)
    if (!condition) return res.status(404).json({ error: 'Condição não encontrada' })
    res.json(condition)
  } catch (err) { console.error('[GET /conditions/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { name, synptoms } = req.body
  if (!name) return res.status(400).json({ error: 'name é obrigatório' })
  try {
    const id = await createCondition({ name, synptoms })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /conditions]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { name, synptoms } = req.body
  try {
    const affected = await updateCondition(id, { name, synptoms })
    if (!affected) return res.status(404).json({ error: 'Condição não encontrada' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /conditions/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteCondition(id)
//     if (!affected) return res.status(404).json({ error: 'Condição não encontrada' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /conditions/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
