import { describe, expect, it } from 'vitest'
import { isPlausibleToken, toExpenseRecap, toGroupRecap, upstreamError } from '../server/utils/recap'
import type { PublicExpenseSummary, PublicGroupSummary, SummaryLevel } from '../app/types/summary'

const expense = (level: SummaryLevel): PublicExpenseSummary => ({
  token: 'abc123def456', level, scope: 'expense', expenseId: 'e', groupId: 'g', groupName: 'G', currency: 'XAF',
  description: 'Resto', category: 'food', categoryEmoji: '', totalAmount: 32000, payerName: 'Freddy',
  payeePhone: '+237677123456', date: '2026-11-01T19:00:00Z', status: 'OPEN', visibility: 'PUBLIC',
  amendmentCount: 0, round: null,
  // What tallyno-api really sends: statuses at every level, amounts on DETAILED.
  participants: [
    { id: '1', name: 'Mireille', settled: true, ...(level === 'DETAILED' ? { amount: 6400 } : {}) },
    { id: '2', name: 'Joël', settled: false, ...(level === 'DETAILED' ? { amount: 6400 } : {}) },
    { id: '3', name: 'Brice', settled: false, ...(level === 'DETAILED' ? { amount: 3600 } : {}) },
  ],
  myPart: level === 'PRIVATE' ? { id: '2', name: 'Joël', settled: false, amount: 6400, isMe: true } : null,
  requiresViewerName: false, shareText: 't', shareUrl: 'u', whatsappLink: 'w', charCount: 1,
})

describe('toExpenseRecap', () => {
  it('keeps no name at all on SOCIAL links, only counts', () => {
    const recap = toExpenseRecap(expense('SOCIAL'))
    expect(recap.participants).toEqual([])
    expect(recap.progress).toEqual({ confirmed: 1, pending: 2, total: 3 })
    expect(recap.pendingAmount).toBeNull()
    expect(JSON.stringify(recap)).not.toMatch(/Joël|Brice|Mireille/)
  })

  it('keeps names but no status or amount on PRIVATE links', () => {
    const recap = toExpenseRecap(expense('PRIVATE'))
    expect(recap.participants).toEqual([
      { id: '1', name: 'Mireille' },
      { id: '2', name: 'Joël' },
      { id: '3', name: 'Brice' },
    ])
    expect(recap.myPart).toEqual({ id: '2', name: 'Joël', settled: false, amount: 6400, isMe: true })
  })

  it('keeps everything on DETAILED links and sums what is still owed', () => {
    const recap = toExpenseRecap(expense('DETAILED'))
    expect(recap.participants).toHaveLength(3)
    expect(recap.participants[1]).toMatchObject({ name: 'Joël', settled: false, amount: 6400 })
    expect(recap.pendingAmount).toBe(10000)
  })

  it('drops a myPart the API would send on a non-PRIVATE link', () => {
    const raw = { ...expense('SOCIAL'), myPart: { id: '2', name: 'Joël', settled: false, amount: 6400 } }
    expect(toExpenseRecap(raw).myPart).toBeNull()
  })

  it('flags an unknown viewer name', () => {
    expect(toExpenseRecap(expense('PRIVATE'), true).viewerNotFound).toBe(true)
  })

  it('handles an expense with no participant', () => {
    const recap = toExpenseRecap({ ...expense('DETAILED'), participants: [] })
    expect(recap.progress).toEqual({ confirmed: 0, pending: 0, total: 0 })
    expect(recap.pendingAmount).toBe(0)
  })
})

describe('toGroupRecap', () => {
  const group = (level: SummaryLevel): PublicGroupSummary => ({
    token: 'abc123def456', level, scope: 'group', groupId: 'g', groupName: 'Coloc', currency: 'XAF',
    totalExpenses: 1000, memberCount: 2,
    members: [{ id: '1', name: 'Freddy', balance: 500 }, { id: '2', name: 'Joël', balance: -500 }],
    // tallyno-api does not filter these by level.
    simplifiedDebts: [{ fromName: 'Joël', toName: 'Freddy', amount: 500 }],
    shareText: 't', shareUrl: 'u', whatsappLink: 'w', charCount: 1,
  })

  it('removes balances and transfers on SOCIAL links', () => {
    const recap = toGroupRecap(group('SOCIAL'))
    expect(recap.members).toEqual([{ id: '1', name: 'Freddy' }, { id: '2', name: 'Joël' }])
    expect(recap.simplifiedDebts).toEqual([])
    expect(recap.shareText).toBe('')
  })

  it('keeps them on DETAILED links', () => {
    expect(toGroupRecap(group('DETAILED')).simplifiedDebts).toHaveLength(1)
  })
})

describe('isPlausibleToken', () => {
  it('accepts API tokens and rejects anything else', () => {
    expect(isPlausibleToken('3f9a1c0b7e2d')).toBe(true)
    expect(isPlausibleToken('../../admin')).toBe(false)
    expect(isPlausibleToken('a b')).toBe(false)
    expect(isPlausibleToken('')).toBe(false)
    expect(isPlausibleToken(undefined)).toBe(false)
  })
})

describe('upstreamError', () => {
  it('passes 404 and 410 through, maps the rest to 502, never leaks the message', () => {
    expect(upstreamError({ response: { status: 410 }, message: 'http://api.internal/x' })).toEqual({ statusCode: 410, statusMessage: 'Gone' })
    expect(upstreamError({ response: { status: 404 } })).toEqual({ statusCode: 404, statusMessage: 'Not Found' })
    expect(upstreamError({ response: { status: 500 } })).toEqual({ statusCode: 502, statusMessage: 'Bad Gateway' })
    expect(upstreamError(new Error('ECONNREFUSED'))).toEqual({ statusCode: 502, statusMessage: 'Bad Gateway' })
  })
})
