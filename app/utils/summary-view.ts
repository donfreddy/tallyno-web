import type { ExpenseRecap, RecapParticipant, SummaryLevel } from '../types/summary'

/**
 * Pure view rules for the recap pages, kept free of Vue and Nuxt so they can
 * be unit tested. What data reaches the page at all is decided server side
 * (server/utils/recap.ts); these rules decide how the page reads it.
 */

/** Names with their payment status are only listed on DETAILED links. */
export function listsPaymentStatusByName(level: SummaryLevel): boolean {
  return level === 'DETAILED'
}

export function isRound(expense: Pick<ExpenseRecap, 'round'>): boolean {
  return expense.round !== null
}

/** The viewer's line: myPart on PRIVATE links, the isMe row on DETAILED ones. */
export function findMe(recap: Pick<ExpenseRecap, 'myPart' | 'participants'>): RecapParticipant | null {
  return recap.myPart ?? recap.participants.find(p => p.isMe) ?? null
}

export type MyPartState = 'no-amounts' | 'unknown-name' | 'pick-name' | 'is-payer' | 'owes' | 'settled'

/** What the personal page (/s/:token/me) should show. */
export function myPartState(input: {
  level: SummaryLevel
  viewerName: string | null
  viewerNotFound: boolean
  me: RecapParticipant | null
  payerName: string
}): MyPartState {
  // SOCIAL links carry no individual amount, whatever name is asked.
  if (input.level === 'SOCIAL') return 'no-amounts'
  if (input.viewerNotFound) return 'unknown-name'
  if (!input.viewerName) return 'pick-name'
  if (!input.me || typeof input.me.amount !== 'number') return 'unknown-name'
  if (input.me.name === input.payerName) return 'is-payer'
  return input.me.settled ? 'settled' : 'owes'
}

const CAMEROON = /^(?:\+237|00237|237)?(6\d{8})$/

/**
 * Display form of a Mobile Money number. Cameroon numbers (+237, 9 digits)
 * are grouped as people read them aloud: +237 677 12 34 56. Anything else is
 * returned trimmed, unchanged.
 */
export function formatPhone(raw: string): string {
  const match = CAMEROON.exec(raw.replace(/[\s.-]/g, ''))
  if (!match) return raw.trim()
  const n = match[1]!
  return `+237 ${n.slice(0, 3)} ${n.slice(3, 5)} ${n.slice(5, 7)} ${n.slice(7, 9)}`
}

/** What Mobile Money apps accept: the 9 local digits for Cameroon numbers. */
export function dialablePhone(raw: string): string {
  const compact = raw.replace(/[\s.-]/g, '')
  const match = CAMEROON.exec(compact)
  return match ? match[1]! : compact
}
