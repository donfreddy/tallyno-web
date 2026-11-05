<script setup lang="ts">
import { findMe, isRound, myPartState } from '~/utils/summary-view'

const route = useRoute()
const token = route.params.token as string
const { getExpenseSummary } = useSummary()

// The viewer picks their name; it travels as ?viewerName=. The server answers
// an unknown name with the list again and viewerNotFound, never with an error.
const viewerName = computed(() => {
  const v = route.query.viewerName
  return typeof v === 'string' && v ? v : null
})

const { data: expense, status, error } = await useAsyncData(
  `expense-me-${token}`,
  () => getExpenseSummary(token, viewerName.value),
  { watch: [viewerName] },
)

const round = computed(() => (expense.value ? isRound(expense.value) : false))
const me = computed(() => (expense.value ? findMe(expense.value) : null))
const state = computed(() =>
  expense.value
    ? myPartState({
        level: expense.value.level,
        viewerName: viewerName.value,
        viewerNotFound: expense.value.viewerNotFound,
        me: me.value,
        payerName: expense.value.payerName,
      })
    : null,
)

// Move focus to the answer after a name is picked, so keyboard and screen
// reader users are not left on a button that no longer exists.
const answer = ref<HTMLElement | null>(null)
async function pick(name: string) {
  await navigateTo({ query: { viewerName: name } })
  await nextTick()
  answer.value?.focus()
}

useSeoMeta({
  title: () => (round.value ? 'Ma cotisation' : 'Ma part'),
  ogTitle: () => (expense.value ? `Ta part : ${round.value ? `tour ${expense.value.round!.roundNumber}` : expense.value.description}` : 'Récap Tallyno'),
  ogDescription: () => (expense.value ? `${expense.value.groupName}, sur Tallyno` : ''),
})
</script>

<template>
  <SummarySkeleton v-if="status === 'pending' && !expense" />
  <SummaryState v-else-if="error || !expense" :status="error?.statusCode" />

  <div v-else class="space-y-5">
    <SummaryHeader :expense="expense" />

    <!-- Who are you? -->
    <section v-if="state === 'pick-name' || state === 'unknown-name'">
      <p v-if="state === 'unknown-name'" role="alert" class="mb-3 rounded-xl bg-amber-50 ring-1 ring-amber-200 px-3 py-2.5 text-sm text-amber-900">
        Ce nom ne fait pas partie de ce récap. Choisis le tien dans la liste.
      </p>
      <h2 class="font-bold">Qui es-tu ?</h2>
      <p class="text-sm text-zinc-600">Choisis ton nom pour voir ta part.</p>
      <ul class="mt-3 grid gap-2">
        <li v-for="p in expense.participants" :key="p.id">
          <button
            type="button"
            class="w-full flex items-center gap-3 rounded-xl bg-white ring-1 ring-zinc-200 px-4 py-3 text-left font-semibold hover:ring-petrol-300"
            @click="pick(p.name)"
          >
            <span class="size-9 shrink-0 grid place-items-center rounded-full bg-petrol-100 text-petrol-800 text-sm" aria-hidden="true">
              {{ getInitials(p.name) }}
            </span>
            {{ p.name }}
          </button>
        </li>
      </ul>
    </section>

    <!-- What I owe -->
    <template v-else-if="(state === 'owes' || state === 'settled' || state === 'is-payer') && me">
      <section
        ref="answer"
        tabindex="-1"
        class="rounded-2xl p-5 outline-none"
        :class="state === 'owes' ? 'bg-petrol-900 text-white' : 'bg-emerald-50 ring-1 ring-emerald-200 text-emerald-900'"
      >
        <h2 class="text-sm" :class="state === 'owes' ? 'text-petrol-200' : 'text-emerald-800'">
          {{ me.name }}, {{ round ? 'ta cotisation pour ce tour' : 'ta part' }}
        </h2>
        <p class="mt-1 amount text-4xl font-bold tracking-tight">{{ formatAmount(me.amount ?? 0, expense.currency) }}</p>
        <p class="mt-2" :class="state === 'owes' ? 'text-petrol-100' : ''">
          <template v-if="state === 'is-payer'">Rien à payer : c'est toi qui as avancé cette dépense.</template>
          <template v-else-if="state === 'settled'">C'est réglé : ton paiement est confirmé.</template>
          <template v-else>Tu dois encore payer {{ expense.payerName }}.</template>
        </p>
      </section>

      <template v-if="state === 'owes'">
        <PayInstructions
          v-if="expense.payeePhone"
          :payee-name="expense.payerName"
          :payee-phone="expense.payeePhone"
          :amount="me.amount"
          :currency="expense.currency"
        />
        <p class="text-sm text-zinc-600">
          <template v-if="round">
            Une fois payé, préviens {{ expense.payerName }} ou l'organisateur de la tontine : ton paiement est confirmé
            dans Tallyno.
          </template>
          <template v-else>
            Une fois payé, préviens {{ expense.payerName }} : c'est {{ expense.payerName }} qui confirme dans Tallyno.
          </template>
          Avec l'app, tu déclares ton paiement toi-même.
        </p>
      </template>

      <p class="text-sm">
        <NuxtLink :to="{ query: {} }" class="font-semibold text-petrol-700 underline underline-offset-2">
          Ce n'est pas moi
        </NuxtLink>
      </p>
    </template>

    <!-- SOCIAL link: no individual amount, but the payee and the progress are known -->
    <template v-else>
      <ProgressCard :progress="expense.progress" :pending-amount="null" :currency="expense.currency" :round="round" />
      <PayInstructions
        v-if="expense.payeePhone && expense.progress.pending > 0"
        :payee-name="expense.payerName"
        :payee-phone="expense.payeePhone"
        :currency="expense.currency"
      />
      <p class="text-sm text-zinc-600">
        Ce lien montre l'avancement du groupe, pas la part de chacun. Ton montant est dans l'app Tallyno, ou demande ton
        lien personnel à {{ expense.payerName }}.
      </p>
    </template>

    <InstallCta text="Avec l'app, tu déclares tes paiements et tu suis tous tes groupes." />
  </div>
</template>
