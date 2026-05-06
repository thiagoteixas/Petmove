import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import dogsRouter from './routes/dogs.js'
import metricsRouter from './routes/metrics.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/dogs', dogsRouter)
app.use('/api/dogs', metricsRouter)

app.listen(PORT, () => {
  console.log(`Petmove API → http://localhost:${PORT}`)
})
