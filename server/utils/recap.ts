import type {
  ExpenseRecap,
  GroupRecap,
  PublicExpenseSummary,
  PublicGroupSummary,
  RecapParticipant,
} from '../../app/types/summary'

/**
 * Filters a public summary down to what its token level allows, before it
 * reaches the browser (SSR payload included). tallyno-api returns every
 * participant's status at every level; until it filters itself, this is the
 * boundary.
 */
export function toExpenseRecap(raw: PublicExpenseSummary, viewerNotFound = false): ExpenseRecap {
  const confirmed = raw.participants.filter(p => p.settled).length
  const progress = { confirmed, pending: raw.participants.length - confirmed, total: raw.participants.length }

  let participants: RecapParticipant[]
  let pendingAmount: number | null = null

  if (raw.level === 'DETAILED') {
    participants = raw.participants.map(p => ({ ...p }))
    const pending = raw.participants.filter(p => !p.settled)
    pendingAmount = pending.every(p => typeof p.amount === 'number')
      ? pending.reduce((sum, p) => sum + (p.amount as number), 0)
      : null
  }
  else if (raw.level === 'PRIVATE') {
    // Names only, for the "who are you" picker: no status, no amount.
    participants = raw.participants.map(p => ({ id: p.id, name: p.name }))
  }
  else {
    // SOCIAL is shared to the whole group: counts only, like the WhatsApp text.
    participants = []
  }

  const myPart = raw.level === 'PRIVATE' ? raw.myPart : null

  return { ...raw, participants, myPart, progress, pendingAmount, viewerNotFound }
}

export function toGroupRecap(raw: PublicGroupSummary): GroupRecap {
  if (raw.level !== 'SOCIAL') return raw
  return {
    ...raw,
    members: raw.members.map(m => ({ id: m.id, name: m.name })),
    simplifiedDebts: [],
    // The API's SOCIAL group text still lists "X -> Y : amount": not relayed.
    shareText: '',
    whatsappLink: '',
  }
}

/** Short share tokens from tallyno-api (12 hex chars today); anything else is a 404. */
export function isPlausibleToken(token: string | undefined): token is string {
  return typeof token === 'string' && /^[A-Za-z0-9_-]{6,64}$/.test(token)
}

const STATUS_TEXT: Record<number, string> = {
  400: 'Bad Request',
  404: 'Not Found',
  410: 'Gone',
  502: 'Bad Gateway',
}

/**
 * Maps an upstream failure to a status the pages understand, without leaking
 * the API's internal URL or message. Only 404 and 410 pass through.
 */
export function upstreamError(e: unknown): { statusCode: number; statusMessage: string } {
  const status = (e as { response?: { status?: number } })?.response?.status
  const statusCode = status === 404 || status === 410 ? status : 502
  return { statusCode, statusMessage: STATUS_TEXT[statusCode]! }
}

export function upstreamStatus(e: unknown): number | undefined {
  return (e as { response?: { status?: number } })?.response?.status
}
