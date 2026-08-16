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
