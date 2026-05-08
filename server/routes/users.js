import { Router } from 'express'
import { parseId } from '../utils.js'
import { getAllUsers, getUserById, createUser, updateUser, deleteUser } from '../db/queries.js'

const router = Router()

router.get('/', async (_req, res) => {
  try { res.json(await getAllUsers()) }
  catch (err) { console.error('[GET /users]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.get('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  try {
    const user = await getUserById(id)
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado' })
    res.json(user)
  } catch (err) { console.error('[GET /users/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

router.post('/', async (req, res) => {
  const { username, email, password, phone, age } = req.body
  if (!username || !email || !password)
    return res.status(400).json({ error: 'username, email e password são obrigatórios' })
  try {
    const id = await createUser({ username, email, password, phone, age })
    res.status(201).json({ id })
  } catch (err) {
    console.error('[POST /users]', err)
    if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'Email já cadastrado' })
    res.status(500).json({ error: 'Erro interno' })
  }
})

router.put('/:id', async (req, res) => {
  const id = parseId(req.params.id)
  if (!id) return res.status(400).json({ error: 'ID inválido' })
  const { username, email, phone, age } = req.body
  try {
    const affected = await updateUser(id, { username, email, phone, age })
    if (!affected) return res.status(404).json({ error: 'Usuário não encontrado' })
    res.json({ updated: true })
  } catch (err) { console.error('[PUT /users/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
})

// router.delete('/:id', async (req, res) => {
//   const id = parseId(req.params.id)
//   if (!id) return res.status(400).json({ error: 'ID inválido' })
//   try {
//     const affected = await deleteUser(id)
//     if (!affected) return res.status(404).json({ error: 'Usuário não encontrado' })
//     res.json({ deleted: true })
//   } catch (err) { console.error('[DELETE /users/:id]', err); res.status(500).json({ error: 'Erro interno' }) }
// })

export default router
