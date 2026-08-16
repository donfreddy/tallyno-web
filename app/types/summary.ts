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
