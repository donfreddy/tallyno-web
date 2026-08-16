<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string
const { getExpenseSummary } = useSummary()

// L'identité du viewer arrive par ?viewerName= (aiguillée depuis le lien
// personnel partagé). Pour les tokens PRIVATE, sans nom on montre un picker.
const viewerName = computed(() => {
  const v = route.query.viewerName
  return typeof v === 'string' && v ? v : null
})

const { data, pending, error } = await useAsyncData(
  `expense-me-${token}-${viewerName.value ?? ''}`,
  () => getExpenseSummary(token, viewerName.value),
  { watch: [viewerName] },
)

const expense = computed(() => data.value ?? null)
const myPart = computed(() =>
  expense.value?.myPart
  ?? expense.value?.participants.find(p => p.isMe)
  ?? null,
)

// Picker : token PRIVATE sans nom → il faut s'identifier.
const needsName = computed(() => !!expense.value?.requiresViewerName)
// 400 = nom inconnu pour un token PRIVATE → re-picker avec message.
const nameNotFound = computed(() => error.value?.statusCode === 400)
const showPicker = computed(() => !pending.value && (needsName.value || nameNotFound.value))
// SOCIAL : aucun montant individuel → vue personnelle inutile.
const noIndividualAmounts = computed(() =>
  !showPicker.value && expense.value?.level === 'SOCIAL' && !myPart.value,
)

async function selectName(name: string) {
  await navigateTo({ query: { viewerName: name } })
}

useSeoMeta({
  title: () => myPart.value ? `Ta part · ${expense.value?.description}` : 'Tallyno',
  description: () => myPart.value
    ? `Tu dois ${formatAmount(myPart.value.amount ?? 0, expense.value?.currency ?? 'XAF')} à ${expense.value?.payerName}`
    : '',
  ogTitle: () => myPart.value
    ? `💰 Tu dois ${formatAmount(myPart.value.amount ?? 0, expense.value?.currency ?? 'XAF')} à ${expense.value?.payerName}`
    : 'Tallyno',
})
</script>

<template>
  <div class="max-w-lg mx-auto px-4 pb-8 pt-5">

    <SummarySkeleton v-if="pending" />
    <TokenExpired v-else-if="error?.statusCode === 410" />
    <SummaryError v-else-if="error && error.statusCode !== 400" />

    <!-- Picker d'identité pour les tokens PRIVATE -->
    <div v-else-if="showPicker && expense" class="animate-slide-up">
      <div class="flex items-center gap-2 mb-4">
        <span class="text-2xl">{{ expense.categoryEmoji }}</span>
        <h1 class="text-lg font-bold text-zinc-900 tracking-tight">{{ expense.description }}</h1>
      </div>

      <p v-if="nameNotFound" class="text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 mb-4">
        Ce nom n'existe pas dans cette dépense. Choisis le tien ci-dessous.
      </p>

      <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm p-5">
        <p class="text-sm font-semibold text-zinc-800 mb-1">Qui es-tu ?</p>
        <p class="text-xs text-zinc-500 mb-4">
          Choisis ton nom pour voir <span class="font-semibold text-zinc-700">ta part</span> de cette dépense.
        </p>
        <div class="space-y-2">
          <button
            v-for="p in expense.participants"
            :key="p.id"
            class="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-zinc-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-left"
            @click="selectName(p.name)">
            <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
              :class="getAvatarColor(p.name)">
              {{ getInitials(p.name) }}
            </div>
            <span class="text-sm font-semibold text-zinc-800 flex-1">{{ p.name }}</span>
            <svg class="w-4 h-4 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      <SummaryFooter class="mt-4" />
    </div>

    <template v-else-if="expense && myPart">

      <!-- Vue personnelle — ta part uniquement -->
      <div class="animate-slide-up">
        <div
          class="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-200 rounded-full px-3 py-1.5 mb-4">
          <span class="text-indigo-600 text-xs">👤</span>
          <span class="text-xs font-medium text-indigo-600">Ton résumé personnel</span>
        </div>

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
              {{ formatAmount(myPart.amount ?? 0, expense.currency) }}
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
        <PayDeepLink v-if="expense.payeePhone" :payee-name="expense.payerName" :payee-phone="expense.payeePhone"
          :amount="myPart.amount ?? 0" :currency="expense.currency" />

        <template v-if="expense.payeePhone">
          <div class="h-px bg-zinc-100" />
        </template>

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

    <!-- SOCIAL : aucun montant individuel sur ce lien -->
    <div v-else-if="noIndividualAmounts" class="animate-slide-up text-center pt-10">
      <div class="text-4xl mb-3">🔒</div>
      <h2 class="text-lg font-bold text-zinc-800 mb-2">Montants privés sur ce lien</h2>
      <p class="text-sm text-zinc-500 max-w-xs mx-auto mb-6">
        Ce lien ne révèle pas les montants individuels. Ouvre Tallyno pour voir ta part.
      </p>
      <DownloadAppBanner />
      <SummaryFooter class="mt-4" />
    </div>

  </div>
</template>
