<script setup lang="ts">
import { useFakeData, formatAmount } from '~/composables/useFakeData'

const route = useRoute()
const token = route.params.token as string
const { getMyViewByToken } = useFakeData()

const { data, pending, error } = await useAsyncData(
  `expense-me-${token}`,
  () => getMyViewByToken(token),
)

const expense = computed(() => data.value?.expense)
const myPart = computed(() => data.value?.myPart)

useSeoMeta({
  title: () => myPart.value ? `Ta part · ${expense.value?.description}` : 'Tallyno',
  description: () => myPart.value
    ? `Tu dois ${formatAmount(myPart.value.amount, expense.value?.currency ?? 'XAF')} à ${expense.value?.payerName}`
    : '',
  ogTitle: () => myPart.value
    ? `💰 Tu dois ${formatAmount(myPart.value.amount, expense.value?.currency ?? 'XAF')} à ${expense.value?.payerName}`
    : 'Tallyno',
})
</script>

<template>
  <div class="max-w-lg mx-auto px-4 pb-8 pt-5">

    <SummarySkeleton v-if="pending" />
    <TokenExpired v-else-if="error?.statusCode === 410" />
    <SummaryError v-else-if="error" />

    <template v-else-if="expense && myPart">

      <!-- Vue personnelle — ta part uniquement -->
      <div class="animate-slide-up">
        <!-- Badge "ta vue" -->
        <div class="inline-flex items-center gap-1.5 bg-brand-50 border border-brand-200 rounded-full px-3 py-1.5 mb-4">
          <span class="text-brand-500 text-xs">👤</span>
          <span class="text-xs font-medium text-brand-600">Ton résumé personnel</span>
        </div>

        <!-- Titre -->
        <div class="text-2xl mb-1">{{ expense.categoryEmoji }}</div>
        <h1 class="text-2xl font-bold text-zinc-900 tracking-tight">{{ expense.description }}</h1>
        <p class="text-sm text-zinc-500 mt-1">
          Groupe : <span class="font-medium text-zinc-700">{{ expense.groupName }}</span>
        </p>
      </div>

      <!-- Ma part — card centrale -->
      <div class="mt-5 rounded-2xl p-5 animate-slide-up delay-100" :class="myPart.settled
        ? 'bg-emerald-50 border border-emerald-200'
        : 'bg-amber-50 border border-amber-200'">
        <p class="text-xs font-semibold uppercase tracking-wider mb-1"
          :class="myPart.settled ? 'text-emerald-600' : 'text-amber-600'">
          Ta part
        </p>

        <div class="flex items-end justify-between">
          <div>
            <p class="text-3xl font-bold font-mono tracking-tight"
              :class="myPart.settled ? 'text-emerald-700' : 'text-amber-700'">
              {{ formatAmount(myPart.amount, expense.currency) }}
            </p>
            <p class="text-sm mt-1" :class="myPart.settled ? 'text-emerald-600' : 'text-amber-700'">
              → <span class="font-semibold">{{ expense.payerName }}</span>
            </p>
          </div>

          <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            :class="myPart.settled ? 'bg-emerald-100' : 'bg-amber-100'">
            {{ myPart.settled ? '✅' : '⏳' }}
          </div>
        </div>

        <p v-if="myPart.settled" class="text-xs text-emerald-600 font-medium mt-3 flex items-center gap-1">
          <span>✓</span> Paiement confirmé par {{ expense.payerName }}
        </p>
        <p v-else class="text-xs text-amber-600 mt-3">
          {{ expense.payerName }} attend ta confirmation de paiement.
        </p>
      </div>

      <!-- Actions si pas settlé -->
      <div v-if="!myPart.settled" class="mt-5 space-y-4">
        <div class="animate-slide-up delay-200">
          <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
            Rembourser {{ expense.payerName }}
          </p>
          <PayDeepLink :payee-name="expense.payerName" :payee-phone="'+237691001001'" :amount="myPart.amount"
            :currency="expense.currency" />
        </div>

        <!-- Séparateur -->
        <div class="h-px bg-zinc-100" />

        <!-- CTA app pour marquer payé -->
        <div class="animate-slide-up delay-300 bg-zinc-50 rounded-2xl border border-zinc-200 p-4">
          <p class="text-sm font-semibold text-zinc-800 mb-1">Une fois payé...</p>
          <p class="text-xs text-zinc-500 mb-3">
            Ouvre Tallyno pour confirmer ton paiement à {{ expense.payerName }}.
            Il recevra une notification instantanée.
          </p>
          <DownloadAppBanner :compact="true" />
        </div>
      </div>

      <!-- Déjà settlé - message positif -->
      <div v-else class="mt-5 animate-slide-up delay-200">
        <div class="text-center py-4">
          <p class="text-4xl mb-2">🎉</p>
          <p class="text-sm font-semibold text-zinc-700">Tu es à jour !</p>
          <p class="text-xs text-zinc-500 mt-1">
            Ton paiement a été confirmé par {{ expense.payerName }}.
          </p>
        </div>
        <DownloadAppBanner />
      </div>

      <SummaryFooter class="mt-4" />
    </template>
  </div>
</template>