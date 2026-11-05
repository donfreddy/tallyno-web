import { describe, expect, it } from 'vitest'
import { formatAmount, formatDate, getInitials } from '../app/utils/format'

describe('formatDate', () => {
  it('prints the Cameroon date, not the server one', () => {
    // 23:30 UTC on the 24th is already the 25th in Douala (UTC+1).
    expect(formatDate('2026-11-24T23:30:00Z')).toBe('mercredi 25 novembre')
  })
})

describe('formatAmount', () => {
  it('formats FCFA without decimals', () => {
    expect(formatAmount(6400).replace(/\s/g, ' ')).toBe('6 400 FCFA')
  })
})

describe('getInitials', () => {
  it('keeps two letters and ignores extra spaces', () => {
    expect(getInitials('Marie  Claire Ngo')).toBe('MC')
    expect(getInitials('Joël')).toBe('J')
  })
})
