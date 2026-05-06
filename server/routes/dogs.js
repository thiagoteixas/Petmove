import { Router } from 'express'
import { getDogById } from '../db/queries.js'

const router = Router()

// Validate that :id is a safe positive integer before it ever reaches the DB.
// Parameterized queries already prevent SQL injection, but this stops
// malformed input from reaching application logic at all.
function parseId(raw) {
  const n = Number(raw)
  return Number.isInteger(n) && n > 0 ? n : null
}

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })

  try {
    const dog = await getDogById(id)
    if (!dog) return res.status(404).json({ error: 'Pet não encontrado' })
    res.json(dog)
  } catch (err) {
    console.error('[GET /dogs/:id]', err)
    res.status(500).json({ error: 'Erro interno' })
  }
})

export default router
