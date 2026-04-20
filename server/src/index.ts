import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
dotenv.config({ path: fileURLToPath(new URL('../../.env', import.meta.url)) })

import express from 'express'
import cors from 'cors'
import { partiesRouter } from './routes/parties.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api', partiesRouter)

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
