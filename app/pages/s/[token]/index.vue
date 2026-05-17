<script setup lang="ts">
import { useFakeData, formatAmount } from '~/composables/useFakeData'

const route = useRoute()
const token = route.params.token as string
const { getExpenseByToken } = useFakeData()

// SSR — server:true est simulé ici avec l'await au top-level
// En prod : useFetch(`/api/summary/${token}`, { server: true })
const { data: expense, pending, error } = await useAsyncData(
  `expense-${token}`,
  () => getExpenseByToken(token),
)

// Open Graph — SSR pour que WhatsApp les lise dans le HTML initial
const confirmedCount = computed(() => expense.value?.participants.filter(p => p.settled).length ?? 0)
const pendingCount = computed(() => expense.value?.participants.filter(p => !p.settled).length ?? 0)

useSeoMeta({
  title: () => expense.value ? `${expense.value.payerName} · ${expense.value.description}` : 'Tallyno',
  description: () => expense.value
    ? `${formatAmount(expense.value.totalAmount, expense.value.currency)} · ${pendingCount.value} paiement${pendingCount.value > 1 ? 's' : ''} en attente`
    : '',
  ogTitle: () => expense.value ? `💰 ${expense.value.description} — ${formatAmount(expense.value.totalAmount, expense.value.currency)}` : 'Tallyno',
  ogDescription: () => expense.value
    ? `Payé par ${expense.value.payerName} · ${pendingCount.value} personne${pendingCount.value > 1 ? 's' : ''} doit encore rembourser`
    : '',
  ogImage: 'https://tallyno.app/og-default.png',
  twitterCard: 'summary',
})

// Share data pour WhatsApp
const shareUrl = `https://tallyno.app/s/${token}`
const shareText = computed(() => expense.value
  ? `${expense.value.categoryEmoji} ${expense.value.description}\n\nTotal : ${formatAmount(expense.value.totalAmount, expense.value.currency)} · Payé par ${expense.value.payerName}\n⏳ ${pendingCount.value} paiement${pendingCount.value > 1 ? 's' : ''} en attente · Voir ta part 👇`
  : ''
)
</script>

<template>
  <div class="max-w-lg mx-auto px-4 pb-8 pt-5">

    <!-- Loading skeleton -->
    <SummarySkeleton v-if="pending" />

    <!-- Erreur générique -->
    <SummaryError v-else-if="error && error.statusCode !== 410" />

    <!-- Lien expiré -->
    <TokenExpired v-else-if="error?.statusCode === 410" />

    <!-- Contenu principal -->
    <template v-else-if="expense">

      <!-- En-tête dépense -->
      <SummaryHeader :expense="expense" />

      <!-- Séparateur -->
      <div class="my-5 h-px bg-zinc-100" />

      <!-- Liste participants — SOCIAL : pas de montants individuels -->
      <div class="animate-slide-up delay-100">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Participants ({{ expense.participants.length }})
        </p>
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm divide-y divide-zinc-50 overflow-hidden">
          <div v-for="p in expense.participants" :key="p.id" class="px-4">
            <DebtLine :participant="p" :currency="expense.currency" :show-amount="false" />
          </div>
        </div>

        <!-- Note confidentialité -->
        <p class="text-[11px] text-zinc-400 text-center mt-2.5 flex items-center justify-center gap-1">
          <span>🔒</span>
          Les montants individuels sont privés · Voir ta part via ton lien personnel
        </p>
      </div>

      <!-- Séparateur -->
      <div class="my-5 h-px bg-zinc-100" />

      <!-- CTA paiement - si je suis participant non-settlé -->
      <div class="space-y-4">
        <div class="animate-slide-up delay-200">
          <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Rembourser
          </p>
          <PayDeepLink :payee-name="expense.payerName" :payee-phone="'+237691001001'"
            :amount="expense.participants[0]!.amount" :currency="expense.currency" />
        </div>

        <!-- Séparateur -->
        <div class="h-px bg-zinc-100" />

        <!-- Partage -->
        <div class="animate-slide-up delay-300">
          <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Relancer le groupe
          </p>
          <ShareSummary :share-url="shareUrl" :share-text="shareText" label="Partager le résumé" />
        </div>

        <!-- Séparateur -->
        <div class="h-px bg-zinc-100" />

        <!-- Download banner -->
        <DownloadAppBanner />

        <!-- Footer -->
        <SummaryFooter />
      </div>

    </template>
  </div>
</template>