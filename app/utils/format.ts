export function formatAmount(amount: number, currency = 'XAF'): string {
  return new Intl.NumberFormat('fr-FR', { currency, style: 'currency', maximumFractionDigits: 0 }).format(amount)
}

export function formatDate(isoString: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    // Due dates are Cameroon dates: a UTC server would print the day before.
    timeZone: 'Africa/Douala',
  }).format(new Date(isoString))
}

export function getInitials(name: string): string {
  return name.split(' ').filter(Boolean).map(w => w[0]).join('').toUpperCase().slice(0, 2)
}
