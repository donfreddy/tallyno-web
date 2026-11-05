// Shapes of the public summary endpoints served by tallyno-api.
// Source of truth: src/application/summary/services/public-summary.service.ts

export type SummaryLevel = 'SOCIAL' | 'DETAILED' | 'PRIVATE'

export interface PublicParticipant {
  id: string
  name: string
  settled: boolean
  /** Present only when the token level grants amounts (DETAILED or PRIVATE). */
  amount?: number
  /** True for the participant matching ?viewerName=. */
  isMe?: boolean
}

export interface PublicExpenseSummary {
  token: string
  level: SummaryLevel
  scope: 'expense'
  expenseId: string
  groupId: string
  groupName: string
  currency: string
  description: string
  category: string
  categoryEmoji: string
  totalAmount: number
  payerName: string
  /** Mobile Money number of the payee, for the payment deep links. */
  payeePhone: string | null
  date: string
  status: 'OPEN' | 'LOCKED' | 'CANCELLED'
  visibility: 'PUBLIC' | 'SEALED'
  amendmentCount: number
  /** Tontine round mode: the pot is paid to this number. */
  round: {
    roundNumber: number
    paymentPhone: string | null
    dueDate: string
  } | null
  participants: PublicParticipant[]
  myPart: PublicParticipant | null
  /** True when the PRIVATE level needs the viewer to identify themselves. */
  requiresViewerName: boolean
  shareText: string
  shareUrl: string
  whatsappLink: string
  charCount: number
}

export interface PublicGroupSummary {
  token: string
  level: SummaryLevel
  scope: 'group'
  groupId: string
  groupName: string
  currency: string
  totalExpenses: number
  memberCount: number
  members: Array<{ id: string; name: string; balance?: number }>
  simplifiedDebts: Array<{ fromName: string; toName: string; amount: number }>
  shareText: string
  shareUrl: string
  whatsappLink: string
  charCount: number
}

// ── What this app's server hands to the pages (server/utils/recap.ts) ─────
// The raw API answer is never sent to the browser: it carries every
// participant's status even on SOCIAL links. These are the filtered shapes.

export interface RecapProgress {
  confirmed: number
  pending: number
  total: number
}

/** A participant as the page may see it: fields are dropped by level. */
export interface RecapParticipant {
  id: string
  name: string
  settled?: boolean
  amount?: number
  isMe?: boolean
}

export interface ExpenseRecap extends Omit<PublicExpenseSummary, 'participants'> {
  /** SOCIAL: empty. PRIVATE: names only. DETAILED: everything. */
  participants: RecapParticipant[]
  /** Computed before filtering, so counts survive on SOCIAL links. */
  progress: RecapProgress
  /** Sum still owed; null when the level hides amounts. */
  pendingAmount: number | null
  /** The ?viewerName= did not match: the list is returned for the picker. */
  viewerNotFound: boolean
}

export type GroupRecap = PublicGroupSummary
