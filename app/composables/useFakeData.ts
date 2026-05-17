export interface Participant {
  id: string
  name: string
  phone: string
  amount: number
  settled: boolean
  isMe: boolean
  avatarUrl: string | null
}

export interface ExpenseSummary {
  id: string
  description: string
  category: string
  categoryEmoji: string
  totalAmount: number
  currency: string
  payerName: string
  payerId: string
  date: string        // ISO string
  visibility: 'PUBLIC' | 'SEALED'
  status: 'OPEN' | 'LOCKED'
  groupName: string
  participants: Participant[]
  amendmentCount: number
}

export interface MemberBalance {
  id: string
  name: string
  phone: string
  balance: number   // positif = créditeur, négatif = débiteur
  isMe: boolean
}

export interface SimplifiedDebt {
  fromName: string
  toName: string
  amount: number
}

export interface GroupSummary {
  id: string
  name: string
  currency: string
  totalExpenses: number
  memberCount: number
  members: MemberBalance[]
  simplifiedDebts: SimplifiedDebt[]
}

// ─── Fake data ────────────────────────────────────────────────────────────────

const FAKE_EXPENSE: ExpenseSummary = {
  id: 'exp-001',
  description: 'Snack Maison H',
  category: 'food',
  categoryEmoji: '🍔',
  totalAmount: 32_000,
  currency: 'XAF',
  payerName: 'Freddy',
  payerId: 'user-freddy',
  date: '2026-05-10T20:30:00Z',
  visibility: 'PUBLIC',
  status: 'LOCKED',
  groupName: 'Les Potes 🔥',
  amendmentCount: 1,
  participants: [
    { id: 'user-freddy', name: 'Freddy', phone: '+237691001001', amount: 8_000, settled: true, isMe: false, avatarUrl: null },
    { id: 'user-marie', name: 'Marie', phone: '+237691002002', amount: 8_000, settled: true, isMe: false, avatarUrl: null },
    { id: 'user-paul', name: 'Paul', phone: '+237691003003', amount: 8_000, settled: false, isMe: true, avatarUrl: null },
    { id: 'user-kevin', name: 'Kevin', phone: '+237691004004', amount: 8_000, settled: false, isMe: false, avatarUrl: null },
  ],
}

const FAKE_GROUP: GroupSummary = {
  id: 'grp-001',
  name: 'Road Trip Kribi 🏖️',
  currency: 'XAF',
  totalExpenses: 185_000,
  memberCount: 4,
  members: [
    { id: 'user-freddy', name: 'Freddy', phone: '+237691001001', balance: 47_500, isMe: false },
    { id: 'user-marie', name: 'Marie', phone: '+237691002002', balance: -12_000, isMe: true },
    { id: 'user-kevin', name: 'Kevin', phone: '+237691004004', balance: -35_500, isMe: false },
    { id: 'user-paul', name: 'Paul', phone: '+237691003003', balance: 0, isMe: false },
  ],
  simplifiedDebts: [
    { fromName: 'Kevin', toName: 'Freddy', amount: 35_500 },
    { fromName: 'Marie', toName: 'Freddy', amount: 12_000 },
  ],
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useFakeData() {
  /**
   * Simule un fetch de dépense par token.
   * En production : GET /api/summary/:token
   */
  const getExpenseByToken = async (_token: string): Promise<ExpenseSummary> => {
    await new Promise(r => setTimeout(r, 400)) // simuler la latence réseau
    return { ...FAKE_EXPENSE }
  }

  /**
   * Simule un fetch de la vue personnelle (ma part uniquement).
   * En production : GET /api/summary/:token/me
   */
  const getMyViewByToken = async (_token: string): Promise<{
    expense: ExpenseSummary
    myPart: Participant
  }> => {
    await new Promise(r => setTimeout(r, 300))
    const expense = { ...FAKE_EXPENSE }
    const myPart = expense.participants.find(p => p.isMe)!
    return { expense, myPart }
  }

  /**
   * Simule un fetch du summary consolidé du groupe.
   * En production : GET /api/summary/g/:token
   */
  const getGroupByToken = async (_token: string): Promise<GroupSummary> => {
    await new Promise(r => setTimeout(r, 500))
    return { ...FAKE_GROUP }
  }

  return { getExpenseByToken, getMyViewByToken, getGroupByToken }
}

// ─── Utils ────────────────────────────────────────────────────────────────────

export function formatAmount(amount: number, currency = 'XAF'): string {
  return new Intl.NumberFormat('fr-FR', { currency, style: 'currency' }).format(amount)
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(new Date(isoString))
}

export function getInitials(name: string): string {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

export function getAvatarColor(name: string): string {
  const colors = [
    'bg-violet-500', 'bg-blue-500', 'bg-emerald-500',
    'bg-amber-500', 'bg-rose-500', 'bg-cyan-500',
  ]
  const idx = name.charCodeAt(0) % colors.length
  return colors[idx]!
}