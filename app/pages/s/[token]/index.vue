<script setup lang="ts">
import { isRound, listsPaymentStatusByName } from '~/utils/summary-view'

const route = useRoute()
const token = route.params.token as string
const { getExpenseSummary } = useSummary()
const { public: { siteUrl } } = useRuntimeConfig()

const { data: expense, pending, error } = await useAsyncData(`expense-${token}`, () => getExpenseSummary(token))

const round = computed(() => (expense.value ? isRound(expense.value) : false))
const progress = computed(() => expense.value?.progress ?? { confirmed: 0, pending: 0, total: 0 })
const showNames = computed(() => (expense.value ? listsPaymentStatusByName(expense.value.level) : false))
const shareUrl = computed(() => expense.value?.shareUrl ?? new URL(`/s/${token}`, siteUrl).href)

// Open Graph is rendered on the server so WhatsApp reads it from the first HTML.
useSeoMeta({
  title: () => {
    if (!expense.value) return 'Récap'
    return round.value ? `Tour ${expense.value.round!.roundNumber}, ${expense.value.groupName}` : expense.value.description
  },
  ogTitle: () => {
    if (!expense.value) return 'Récap Tallyno'
    return round.value
      ? `Tour ${expense.value.round!.roundNumber} : ${expense.value.payerName} reçoit`
      : `${expense.value.description} : ${formatAmount(expense.value.totalAmount, expense.value.currency)}`
  },
  description: () => (expense.value ? `${progress.value.confirmed} sur ${progress.value.total} paiements confirmés` : ''),
  ogDescription: () => (expense.value ? `${progress.value.confirmed} sur ${progress.value.total} paiements confirmés` : ''),
})
</script>

<template>
  <SummarySkeleton v-if="pending" />
  <SummaryState v-else-if="error || !expense" :status="error?.statusCode" />

  <div v-else class="space-y-5">
    <SummaryHeader :expense="expense" />

    <ProgressCard
      :progress="progress"
      :pending-amount="expense.pendingAmount"
      :currency="expense.currency"
      :round="round"
    />

    <ParticipantList v-if="showNames" :participants="expense.participants" :currency="expense.currency" />

    <NuxtLink
      :to="`/s/${token}/me`"
      class="flex items-center justify-between rounded-2xl bg-white ring-1 ring-zinc-200 px-4 py-4 font-semibold hover:ring-petrol-300"
    >
      {{ round ? 'Voir ma cotisation et comment payer' : 'Voir ma part et comment payer' }}
      <svg class="size-5 text-petrol-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
      </svg>
    </NuxtLink>

    <section v-if="expense.shareText">
      <h2 class="mb-2 font-bold">Partager ce récap</h2>
      <ShareSummary :share-url="shareUrl" :share-text="expense.shareText" label="Envoyer dans le groupe" />
    </section>

    <InstallCta text="Avec l'app, tu déclares tes paiements et tu suis tous tes groupes." />
  </div>
</template>
