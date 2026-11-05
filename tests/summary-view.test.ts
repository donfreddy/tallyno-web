import { describe, expect, it } from 'vitest'
import { dialablePhone, findMe, formatPhone, isRound, listsPaymentStatusByName, myPartState } from '../app/utils/summary-view'
import type { RecapParticipant } from '../app/types/summary'

const me = (name: string, settled: boolean, amount?: number): RecapParticipant => ({
  id: name,
  name,
  settled,
  isMe: true,
  ...(amount === undefined ? {} : { amount }),
})

describe('listsPaymentStatusByName', () => {
  it('only names payers on DETAILED links', () => {
    expect(listsPaymentStatusByName('DETAILED')).toBe(true)
    expect(listsPaymentStatusByName('SOCIAL')).toBe(false)
    expect(listsPaymentStatusByName('PRIVATE')).toBe(false)
  })
})

describe('isRound', () => {
  it('tells a tontine round from an expense', () => {
    expect(isRound({ round: { roundNumber: 5, paymentPhone: null, dueDate: '2026-11-25' } })).toBe(true)
    expect(isRound({ round: null })).toBe(false)
  })
})

describe('findMe', () => {
  it('uses myPart on PRIVATE links', () => {
    const part = me('Joël', false, 6400)
    expect(findMe({ myPart: part, participants: [{ id: 'Joël', name: 'Joël' }] })).toBe(part)
  })

  it('uses the isMe row on DETAILED links', () => {
    const row = me('Joël', false, 6400)
    expect(findMe({ myPart: null, participants: [{ id: 'A', name: 'A', settled: true, amount: 1 }, row] })).toBe(row)
  })

  it('returns null when nobody matches', () => {
    expect(findMe({ myPart: null, participants: [{ id: 'A', name: 'A' }] })).toBeNull()
  })
})

describe('myPartState', () => {
  const base = { level: 'PRIVATE' as const, viewerName: 'Joël', viewerNotFound: false, me: null, payerName: 'Freddy' }

  it('never shows an amount on SOCIAL links, even with a name', () => {
    expect(myPartState({ ...base, level: 'SOCIAL', me: me('Joël', false, 6400) })).toBe('no-amounts')
  })

  it('asks for a name when none is given, on PRIVATE and DETAILED links', () => {
    expect(myPartState({ ...base, viewerName: null })).toBe('pick-name')
    expect(myPartState({ ...base, level: 'DETAILED', viewerName: null })).toBe('pick-name')
  })

  it('reports an unknown name from the server, or a name with no row', () => {
    expect(myPartState({ ...base, viewerNotFound: true })).toBe('unknown-name')
    expect(myPartState({ ...base, level: 'DETAILED', viewerName: 'Zed' })).toBe('unknown-name')
  })

  it('shows what is owed, or that it is settled', () => {
    expect(myPartState({ ...base, me: me('Joël', false, 6400) })).toBe('owes')
    expect(myPartState({ ...base, level: 'DETAILED', me: me('Joël', true, 6400) })).toBe('settled')
  })

  it('recognises the person who advanced the money', () => {
    expect(myPartState({ ...base, viewerName: 'Freddy', me: me('Freddy', true, 6400) })).toBe('is-payer')
  })
})

describe('formatPhone', () => {
  it('groups Cameroon numbers whatever the prefix', () => {
    expect(formatPhone('+237677123456')).toBe('+237 677 12 34 56')
    expect(formatPhone('00237 677 12 34 56')).toBe('+237 677 12 34 56')
    expect(formatPhone('237677123456')).toBe('+237 677 12 34 56')
    expect(formatPhone('677 12 34 56')).toBe('+237 677 12 34 56')
  })

  it('leaves other numbers untouched', () => {
    expect(formatPhone(' +2250701020304 ')).toBe('+2250701020304')
    expect(formatPhone('+237 2 33 42 00 00')).toBe('+237 2 33 42 00 00')
  })
})

describe('dialablePhone', () => {
  it('keeps the 9 local digits for Cameroon numbers', () => {
    expect(dialablePhone('+237 677 12 34 56')).toBe('677123456')
    expect(dialablePhone('00237677123456')).toBe('677123456')
  })

  it('only strips separators otherwise', () => {
    expect(dialablePhone('+225 07-01-02-03-04')).toBe('+2250701020304')
  })
})
