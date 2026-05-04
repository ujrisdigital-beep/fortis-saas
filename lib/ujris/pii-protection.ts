// UJRIS PII Protection Layer
// Zero-access encryption for sensitive case data. Court order required for PII access.
// Uses existing Prisma CourtOrder + AccessLog models (see prisma/schema.prisma).

import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const KEY_LEN = 32
const IV_LEN = 16
const TAG_LEN = 16

function getEncryptionKey(): Buffer {
  const raw = process.env.UJRIS_PII_ENCRYPTION_KEY
  if (!raw || raw.length < KEY_LEN) {
    throw new Error('UJRIS_PII_ENCRYPTION_KEY must be set and at least 32 characters')
  }
  return Buffer.from(raw.slice(0, KEY_LEN), 'utf8')
}

export interface EncryptedPayload {
  iv: string
  tag: string
  ciphertext: string
}

export function encryptPII(plaintext: string): EncryptedPayload {
  const key = getEncryptionKey()
  const iv = crypto.randomBytes(IV_LEN)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv) as crypto.CipherGCM
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return {
    iv: iv.toString('hex'),
    tag: tag.toString('hex'),
    ciphertext: encrypted.toString('hex'),
  }
}

export function decryptPII(payload: EncryptedPayload): string {
  const key = getEncryptionKey()
  const iv = Buffer.from(payload.iv, 'hex')
  const tag = Buffer.from(payload.tag, 'hex')
  const ciphertext = Buffer.from(payload.ciphertext, 'hex')
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv) as crypto.DecipherGCM
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8')
}

export function hashUserId(userId: string): string {
  return crypto.createHash('sha256').update(userId + (process.env.UJRIS_HASH_SALT || '')).digest('hex')
}

export function generateCourtOrderToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}

export function generateHMAC(data: string): string {
  const secret = process.env.UJRIS_HMAC_SECRET || process.env.UJRIS_PII_ENCRYPTION_KEY || ''
  return crypto.createHmac('sha256', secret).update(data).digest('hex')
}

export function verifyHMAC(data: string, signature: string): boolean {
  const expected = generateHMAC(data)
  return crypto.timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(signature, 'hex'))
}

export interface CourtOrderValidation {
  valid: boolean
  reason?: string
  expiresAt?: Date
}

// Court order validation: checks the court order record exists, is approved, not revoked, and not expired.
// Caller must import prisma and pass the order record they've looked up.
export function validateCourtOrderRecord(order: {
  approvedAt: Date | null
  revokedAt: Date | null
  expiresAt: Date
  signature: string
  documentHash: string
}): CourtOrderValidation {
  if (!order.approvedAt) {
    return { valid: false, reason: 'Court order has not been approved' }
  }
  if (order.revokedAt) {
    return { valid: false, reason: 'Court order has been revoked' }
  }
  if (new Date() > order.expiresAt) {
    return { valid: false, reason: 'Court order has expired' }
  }
  const sigData = `${order.documentHash}:${order.expiresAt.toISOString()}`
  if (!verifyHMAC(sigData, order.signature)) {
    return { valid: false, reason: 'Court order signature verification failed — tampered record' }
  }
  return { valid: true, expiresAt: order.expiresAt }
}

// Redacts a string to show only first + last char with asterisks, for safe display.
export function redactForDisplay(value: string): string {
  if (value.length <= 2) return '**'
  return value[0] + '*'.repeat(value.length - 2) + value[value.length - 1]
}

// Minimum data principle: strips PII fields from any object before logging.
export function stripPII<T extends Record<string, unknown>>(obj: T, piiFields: string[]): Omit<T, string> {
  const safe = { ...obj }
  for (const field of piiFields) {
    delete (safe as Record<string, unknown>)[field]
  }
  return safe
}

// Standard PII fields to strip from case data before forensic pattern scanning.
export const CASE_PII_FIELDS = [
  'email', 'phone', 'address', 'nationalId', 'passportNumber',
  'bankAccount', 'dateOfBirth', 'fullName', 'nin',
]
