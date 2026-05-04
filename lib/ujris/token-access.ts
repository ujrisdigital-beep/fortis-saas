// UJRIS Service Token System
// Users generate time-limited tokens to grant third parties (solicitors, charities, law centres)
// scoped access to their case. Tokens are stored as SHA-256 hashes — raw token shown once to user.
// Uses Prisma. Requires ServiceAccessToken model (see schema additions below).

import crypto from 'crypto'

export type TokenPermission = 'read' | 'comment' | 'upload' | 'download'

export interface ServiceTokenRecord {
  id: string
  userId: string
  serviceLabel: string
  permissions: TokenPermission[]
  expiresAt: Date
  createdAt: Date
  lastUsedAt: Date | null
  usageCount: number
  revokedAt: Date | null
}

export interface TokenGrant {
  tokenId: string
  rawToken: string        // shown once to user — never stored
  expiresAt: Date
  permissions: TokenPermission[]
  serviceLabel: string
}

export function generateRawToken(): string {
  return crypto.randomBytes(32).toString('hex')
}

export function hashToken(rawToken: string): string {
  return crypto.createHash('sha256').update(rawToken).digest('hex')
}

export function buildTokenGrant(
  tokenId: string,
  rawToken: string,
  serviceLabel: string,
  permissions: TokenPermission[],
  expiresAt: Date,
): TokenGrant {
  return { tokenId, rawToken, expiresAt, permissions, serviceLabel }
}

export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt
}

export function isTokenValid(record: Pick<ServiceTokenRecord, 'revokedAt' | 'expiresAt'>): boolean {
  return !record.revokedAt && !isTokenExpired(record.expiresAt)
}

export function canTokenPerform(record: Pick<ServiceTokenRecord, 'permissions' | 'revokedAt' | 'expiresAt'>, action: TokenPermission): boolean {
  return isTokenValid(record) && record.permissions.includes(action)
}

// Default expiry windows (days)
export const TOKEN_EXPIRY = {
  solicitor: 30,
  lawCentre: 60,
  charity: 90,
  familyMember: 14,
  custom: 30,
} as const

export type ServicePreset = keyof typeof TOKEN_EXPIRY

export function getExpiryDate(preset: ServicePreset = 'custom'): Date {
  const days = TOKEN_EXPIRY[preset]
  const d = new Date()
  d.setDate(d.getDate() + days)
  return d
}

// Default permission sets per service type
export const SERVICE_PERMISSIONS: Record<ServicePreset, TokenPermission[]> = {
  solicitor: ['read', 'comment', 'download'],
  lawCentre: ['read', 'comment', 'upload'],
  charity: ['read', 'comment'],
  familyMember: ['read'],
  custom: ['read'],
}

// Human-readable token summary for display in UI
export function describeToken(record: ServiceTokenRecord): string {
  const expired = isTokenExpired(record.expiresAt)
  const revoked = !!record.revokedAt
  const status = revoked ? 'REVOKED' : expired ? 'EXPIRED' : 'ACTIVE'
  const daysLeft = Math.max(0, Math.ceil((record.expiresAt.getTime() - Date.now()) / 86400000))
  return `${status} | ${record.serviceLabel} | ${record.permissions.join(', ')} | ${revoked || expired ? '' : `${daysLeft}d remaining`} | Used ${record.usageCount}x`
}
