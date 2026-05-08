import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllBreeds, getBreedById, createBreed, updateBreed, deleteBreed } from '../db/queries.js'

const router = Router()

router.get('/', async (_req, res) => {
  try { res.json(await getAllBreeds()) }
  catch (err) { console.error('[GET /breeds]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const breed = await getBreedById(id)
    if (!breed) return res.status(404).json({ error: 'Raça não encontrada' })
    res.json(breed)
  } catch (err) { console.error('[GET /breeds/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { avg_heigth, avg_weigth, life_expectancy, constant, observations } = req.body
  try {
    const id = await createBreed({ avg_heigth, avg_weigth, life_expectancy, constant, observations })
    res.status(201).json({ id })
  } catch (err) { console.error('[POST /breeds]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { avg_heigth, avg_weigth, life_expectancy, constant, observations } = req.body
  try {
    const affected = await updateBreed(id, { avg_heigth, avg_weigth, life_expectancy, constant, observations })
    if (!affected) return res.status(404).json({ error: 'Raça não encontrada' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /breeds/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteBreed(id)
//     if (!affected) return res.status(404).json({ error: 'Raça não encontrada' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /breeds/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
