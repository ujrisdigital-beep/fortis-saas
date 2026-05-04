import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import {
  generateRawToken,
  hashToken,
  buildTokenGrant,
  getExpiryDate,
  SERVICE_PERMISSIONS,
  isTokenValid,
  describeToken,
  type ServicePreset,
  type TokenPermission,
} from '@/lib/ujris/token-access'

// In-memory store for dev. In production, replace with Prisma ServiceAccessToken model.
// Schema addition needed:
// model ServiceAccessToken {
//   id           String    @id @default(cuid())
//   userId       String
//   tokenHash    String    @unique
//   serviceLabel String
//   permissions  String[]
//   expiresAt    DateTime
//   lastUsedAt   DateTime?
//   usageCount   Int       @default(0)
//   revokedAt    DateTime?
//   createdAt    DateTime  @default(now())
// }
const TOKEN_STORE: Map<string, {
  id: string
  userId: string
  tokenHash: string
  serviceLabel: string
  permissions: TokenPermission[]
  expiresAt: Date
  lastUsedAt: Date | null
  usageCount: number
  revokedAt: Date | null
  createdAt: Date
}> = new Map()

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const userId = session.user.id
  const tokens = [...TOKEN_STORE.values()]
    .filter(t => t.userId === userId)
    .map(t => ({
      id: t.id,
      serviceLabel: t.serviceLabel,
      permissions: t.permissions,
      expiresAt: t.expiresAt,
      lastUsedAt: t.lastUsedAt,
      usageCount: t.usageCount,
      revokedAt: t.revokedAt,
      createdAt: t.createdAt,
      active: isTokenValid(t),
      summary: describeToken({
        id: t.id,
        userId: t.userId,
        serviceLabel: t.serviceLabel,
        permissions: t.permissions,
        expiresAt: t.expiresAt,
        createdAt: t.createdAt,
        lastUsedAt: t.lastUsedAt,
        usageCount: t.usageCount,
        revokedAt: t.revokedAt,
      }),
    }))
  return NextResponse.json({ tokens })
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }
  const userId = session.user.id

  const body = await req.json() as {
    action: 'generate' | 'revoke'
    serviceLabel?: string
    preset?: ServicePreset
    permissions?: TokenPermission[]
    expiresInDays?: number
    tokenId?: string
  }

  if (body.action === 'generate') {
    const preset = body.preset || 'custom'
    const serviceLabel = body.serviceLabel || preset
    const permissions = body.permissions || SERVICE_PERMISSIONS[preset]
    const expiresAt = body.expiresInDays
      ? new Date(Date.now() + body.expiresInDays * 86400000)
      : getExpiryDate(preset)

    const rawToken = generateRawToken()
    const tokenHash = hashToken(rawToken)
    const tokenId = `tok_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`

    TOKEN_STORE.set(tokenId, {
      id: tokenId,
      userId,
      tokenHash,
      serviceLabel,
      permissions,
      expiresAt,
      lastUsedAt: null,
      usageCount: 0,
      revokedAt: null,
      createdAt: new Date(),
    })

    const grant = buildTokenGrant(tokenId, rawToken, serviceLabel, permissions, expiresAt)

    return NextResponse.json({
      ok: true,
      grant,
      warning: 'Store this token securely — it will not be shown again. Share only with your intended recipient.',
    })
  }

  if (body.action === 'revoke') {
    const tokenId = body.tokenId
    if (!tokenId) {
      return NextResponse.json({ error: 'tokenId is required' }, { status: 400 })
    }
    const token = TOKEN_STORE.get(tokenId)
    if (!token || token.userId !== userId) {
      return NextResponse.json({ error: 'Token not found or not yours' }, { status: 404 })
    }
    token.revokedAt = new Date()
    TOKEN_STORE.set(tokenId, token)
    return NextResponse.json({ ok: true, message: 'Token revoked successfully' })
  }

  return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
}

// Token validation endpoint — called by third-party integrations
export async function PUT(req: Request) {
  const body = await req.json() as { rawToken: string; requiredPermission?: TokenPermission }
  if (!body.rawToken) {
    return NextResponse.json({ valid: false, error: 'No token provided' }, { status: 400 })
  }
  const tokenHash = hashToken(body.rawToken)
  const token = [...TOKEN_STORE.values()].find(t => t.tokenHash === tokenHash)
  if (!token) {
    return NextResponse.json({ valid: false, error: 'Invalid token' })
  }
  const valid = isTokenValid(token)
  if (!valid) {
    return NextResponse.json({ valid: false, error: token.revokedAt ? 'Token revoked' : 'Token expired' })
  }
  if (body.requiredPermission && !token.permissions.includes(body.requiredPermission)) {
    return NextResponse.json({ valid: false, error: `Token does not have '${body.requiredPermission}' permission` })
  }
  token.lastUsedAt = new Date()
  token.usageCount++
  TOKEN_STORE.set(token.id, token)
  return NextResponse.json({ valid: true, permissions: token.permissions, serviceLabel: token.serviceLabel })
}
