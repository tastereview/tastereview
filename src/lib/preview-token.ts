import { createHmac } from 'crypto'

const SECRET = process.env.SUPABASE_SERVICE_ROLE_KEY!
const TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

/**
 * Generate a signed preview token for a given form.
 * Format: <signature_hex_16chars>.<timestamp>
 */
export function generatePreviewToken(formId: string): string {
  const timestamp = Date.now().toString()
  const signature = createHmac('sha256', SECRET)
    .update(`${formId}:${timestamp}`)
    .digest('hex')
    .slice(0, 16)
  return `${signature}.${timestamp}`
}

/**
 * Verify a preview token. Returns true if signature is valid and not expired.
 */
export function verifyPreviewToken(formId: string, token: string): boolean {
  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [signature, timestamp] = parts
  const ts = parseInt(timestamp, 10)
  if (isNaN(ts)) return false

  // Check expiry
  if (Date.now() - ts > TOKEN_TTL_MS) return false

  // Verify signature
  const expected = createHmac('sha256', SECRET)
    .update(`${formId}:${timestamp}`)
    .digest('hex')
    .slice(0, 16)

  return signature === expected
}
