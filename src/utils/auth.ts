let cachedToken = ''
let expiresAt = 0

export async function getToken(): Promise<string> {
  if (cachedToken && Date.now() < expiresAt) return cachedToken

  const params = new URLSearchParams({
    grant_type: 'client_credentials',
    'UMS-TENANT': import.meta.env.VITE_UMS_TENANT ?? '',
    'UMS-ENVIRONMENT': import.meta.env.VITE_UMS_ENVIRONMENT ?? '',
    'UMS-APPLICATION': import.meta.env.VITE_UMS_APPLICATION ?? '',
  })


  const resp = await fetch(`/auth/ums/oauth2/token?${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${btoa(`${import.meta.env.VITE_CLIENT_ID}:${import.meta.env.VITE_CLIENT_SECRET}`)}`,
    },
  })

  if (!resp.ok) throw new Error(`auth failed: ${resp.status}`)
  const json = (await resp.json()) as { access_token: string; expires_in: number }
  cachedToken = json.access_token
  expiresAt = Date.now() + (json.expires_in - 30) * 1000
  return cachedToken
}
