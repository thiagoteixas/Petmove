import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import usersRouter       from './routes/users.js'
import collarsRouter     from './routes/collars.js'
import collarLogsRouter  from './routes/collar-logs.js'
import conditionsRouter  from './routes/conditions.js'
import breedsRouter      from './routes/breeds.js'
import dogsRouter        from './routes/dogs.js'
import metricsRouter     from './routes/metrics.js'
import treatmentsRouter  from './routes/treatments.js'
import insightsRouter    from './routes/daily-insights.js'

const app = express()
const PORT = process.env.PORT ?? 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())

app.use('/api/users',          usersRouter)
app.use('/api/collars',        collarsRouter)
app.use('/api/collar-logs',    collarLogsRouter)
app.use('/api/conditions',     conditionsRouter)
app.use('/api/breeds',         breedsRouter)
app.use('/api/dogs',           dogsRouter)
app.use('/api/dogs',           metricsRouter)   // /:id/metrics/today  /:id/metrics/week
app.use('/api/treatments',     treatmentsRouter)
app.use('/api/daily-insights', insightsRouter)

app.listen(PORT, () => {
  console.log(`Petmove API → http://localhost:${PORT}`)
})
