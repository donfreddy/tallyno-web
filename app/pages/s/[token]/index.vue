<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string
const { getExpenseSummary } = useSummary()

const { data: expense, pending, error } = await useAsyncData(
  `expense-${token}`,
  () => getExpenseSummary(token),
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
    ? `Payé par ${expense.value.payerName} · ${pendingCount.value} personne${pendingCount.value > 1 ? 's' : ''} ${pendingCount.value > 1 ? 'doivent' : 'doit'} encore rembourser`
    : '',
  ogImage: 'https://tallyno.app/og-default.png',
  twitterCard: 'summary',
})

// Privacy : seuls les niveaux DETAILED exposent les montants individuels
const showAmounts = computed(() => expense.value?.level === 'DETAILED')
const shareUrl = computed(() => expense.value?.shareUrl ?? `https://tallyno.app/s/${token}`)
const shareText = computed(() => expense.value?.shareText || 'Dépense partagée sur Tallyno')
const meUrl = computed(() => `/s/${token}/me`)
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

      <!-- Liste participants -->
      <div class="animate-slide-up delay-100">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Participants ({{ expense.participants.length }})
        </p>
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm divide-y divide-zinc-50 overflow-hidden">
          <div v-for="p in expense.participants" :key="p.id" class="px-4">
            <DebtLine :participant="p" :currency="expense.currency" :show-amount="showAmounts" />
          </div>
        </div>

        <!-- Note confidentialité -->
        <p v-if="!showAmounts" class="text-[11px] text-zinc-400 text-center mt-2.5 flex items-center justify-center gap-1">
          <span>🔒</span>
          Les montants individuels sont privés • Voir ta part via ton lien personnel
        </p>
      </div>

      <!-- Séparateur -->
      <div class="my-5 h-px bg-zinc-100" />

      <!-- Actions -->
      <div class="space-y-4">
        <!-- Voir ma part -->
        <NuxtLink :to="meUrl"
          class="w-full flex items-center justify-center gap-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-700 font-semibold text-sm rounded-xl px-4 py-3.5 transition-colors animate-slide-up delay-100">
          👤 Voir ma part
        </NuxtLink>

        <!-- Partage -->
        <div class="animate-slide-up delay-200">
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
