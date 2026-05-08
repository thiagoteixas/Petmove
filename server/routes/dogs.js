import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllDogs, getDogById, createDog, updateDog, deleteDog } from '../db/queries.js'

const router = Router()

router.get('/', async (_req, res) => {
  try { res.json(await getAllDogs()) }
  catch (err) { console.error('[GET /dogs]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const dog = await getDogById(id)
    if (!dog) return res.status(404).json({ error: 'Pet não encontrado' })
    res.json(dog)
  } catch (err) { console.error('[GET /dogs/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { name, gender, weight, height, size, user_id, Dog_breed_id, collar_id, birth_date } = req.body
  if (!name || !weight || !height || !user_id || !Dog_breed_id || !collar_id)
    return res.status(400).json({ error: 'name, weight, height, user_id, Dog_breed_id e collar_id são obrigatórios' })
  try {
    const id = await createDog({ name, gender, weight, height, size, user_id, Dog_breed_id, collar_id, birth_date })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /dogs]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { name, gender, weight, height, size, birth_date } = req.body
  try {
    const affected = await updateDog(id, { name, gender, weight, height, size, birth_date })
    if (!affected) return res.status(404).json({ error: 'Pet não encontrado' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /dogs/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteDog(id)
//     if (!affected) return res.status(404).json({ error: 'Pet não encontrado' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /dogs/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
