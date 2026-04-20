let cachedToken = ''
let expiresAt = 0

export async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < expiresAt) return cachedToken

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    'UMS-TENANT': process.env.VITE_UMS_TENANT ?? '',
    'UMS-ENVIRONMENT': process.env.VITE_UMS_ENVIRONMENT ?? '',
    'UMS-APPLICATION': process.env.VITE_UMS_APPLICATION ?? '',
  })

  const resp = await fetch(`${process.env.VITE_AUTH_URL}?${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.VITE_CLIENT_ID}:${process.env.VITE_CLIENT_SECRET}`).toString('base64')}`,
    },
  })

  if (!resp.ok) throw new Error(`auth failed: ${resp.status}`)
  const json = (await resp.json()) as { access_token: string; expires_in: number }
  cachedToken = json.access_token
  expiresAt = Date.now() + (json.expires_in - 30) * 1000
  return cachedToken
}
