import { Router, Request, Response } from 'express'
import { getToken } from '../utils/auth.js'

export const partiesRouter = Router()

partiesRouter.get('/parties', async (req: Request, res: Response) => {
  try {
    const token = await getToken()
    const base = process.env.VITE_BASE_ENDPOINT || 'https://dev.ibapplications.com/rest/v1'
    const query = new URLSearchParams(req.query as Record<string, string>)

    const response = await fetch(`${base}/parties?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: '*/*',
        'Cache-Control': 'no-cache',
        Cookie: process.env.VITE_COOKIE || '',
      },
    })

    if (!response.ok) throw new Error(`upstream error: ${response.status}`)
    res.json(await response.json())
  } catch (err) {
    res.status(500).json({ error: String(err) })
  }
})
