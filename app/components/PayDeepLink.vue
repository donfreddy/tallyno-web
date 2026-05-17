<script setup lang="ts">
const props = defineProps<{
  payeeName: string
  payeePhone: string
  amount: number
  currency: string
}>()

// En production : généré par POST /settlements/deep-link
// Ici on simule les deep links avec les formats documentés
const providers = computed(() => [
  {
    name: 'MTN Mobile Money',
    icon: '🟡',
    color: 'bg-yellow-400 hover:bg-yellow-500',
    textColor: 'text-yellow-900',
    link: `mtn-money://send?to=${props.payeePhone.replace('+', '')}&amount=${props.amount}&note=Tallyno`,
    fallback: 'https://play.google.com/store/apps/details?id=com.mtn.mobilebanking',
  },
  {
    name: 'Orange Money',
    icon: '🟠',
    color: 'bg-orange-500 hover:bg-orange-600',
    textColor: 'text-white',
    link: `orangemoney://transfer?msisdn=${props.payeePhone.replace('+', '')}&amount=${props.amount}`,
    fallback: 'https://orange.cm',
  }
])

const fmt = (n: number) => new Intl.NumberFormat('fr-FR').format(n)

function openLink(link: string, fallback: string) {
  // Tente d'ouvrir le deep link — si l'app n'est pas installée,
  // redirige vers le fallback après 1.5s
  window.location.href = link
  setTimeout(() => {
    window.open(fallback, '_blank')
  }, 1500)
}
</script>

<template>
  <div class="animate-slide-up delay-200">
    <div class="mb-3">
      <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-1">
        Rembourser {{ payeeName }}
      </p>
      <p class="text-sm text-zinc-600">
        <span class="font-bold font-mono text-brand-500">{{ formatAmount(amount, currency) }}</span>
        • {{ payeePhone }}
      </p>
    </div>

    <div class="space-y-2">
      <button v-for="p in providers" :key="p.name"
        class="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-sm transition-all active:scale-[0.98]"
        :class="[p.color, p.textColor]" @click="openLink(p.link, p.fallback)">
        <span class="text-lg leading-none">{{ p.icon }}</span>
        <span class="flex-1 text-left">Payer via {{ p.name }}</span>
        <svg class="w-4 h-4 opacity-70" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>

    <p class="text-[10px] text-zinc-400 text-center mt-3">
      L'argent va directement à {{ payeeName }}. Tallyno ne touche pas aux fonds.
    </p>
  </div>
</template>