<script setup lang="ts">
const route = useRoute()
const token = route.params.token as string
const { getGroupSummary } = useSummary()
const { public: { siteUrl } } = useRuntimeConfig()

const { data: group, pending, error } = await useAsyncData(`group-${token}`, () => getGroupSummary(token))

// SOCIAL hides balances: the API omits them, the page says so instead of showing zeros.
const showBalances = computed(() => (group.value?.level ?? 'SOCIAL') !== 'SOCIAL')
const shareUrl = computed(() => group.value?.shareUrl ?? new URL(`/g/${token}`, siteUrl).href)

function balanceLabel(balance: number) {
  if (balance > 0) return 'À recevoir'
  if (balance < 0) return 'Doit encore payer'
  return 'À jour'
}

useSeoMeta({
  title: () => (group.value ? `Bilan, ${group.value.groupName}` : 'Bilan'),
  ogTitle: () => (group.value ? `Bilan du groupe ${group.value.groupName}` : 'Récap Tallyno'),
  ogDescription: () =>
    group.value ? `${formatAmount(group.value.totalExpenses, group.value.currency)} de dépenses, ${group.value.memberCount} ${group.value.memberCount > 1 ? 'membres' : 'membre'}` : '',
})
</script>

<template>
  <SummarySkeleton v-if="pending" />
  <SummaryState v-else-if="error || !group" :status="error?.statusCode" />

  <div v-else class="space-y-5">
    <header >
      <p class="text-sm font-semibold text-petrol-700">Bilan du groupe</p>
      <h1 class="mt-1 text-3xl font-bold tracking-tight">{{ group.groupName }}</h1>
      <p class="mt-1 text-zinc-600">
        {{ group.memberCount }} {{ group.memberCount > 1 ? 'membres' : 'membre' }},
        <span class="amount font-semibold text-zinc-900">{{ formatAmount(group.totalExpenses, group.currency) }}</span>
        de dépenses.
      </p>
    </header>

    <section v-if="showBalances && group.simplifiedDebts.length" class="rounded-2xl bg-petrol-900 text-white p-5">
      <h2 class="text-sm text-petrol-200">Pour que tout le monde soit à jour</h2>
      <ul class="mt-3 space-y-2.5">
        <li v-for="(d, i) in group.simplifiedDebts" :key="i" class="flex items-baseline justify-between gap-3">
          <span class="min-w-0">
            <strong>{{ d.fromName }}</strong> <span class="text-petrol-200">paie</span> <strong>{{ d.toName }}</strong>
          </span>
          <span class="amount font-semibold">{{ formatAmount(d.amount, group.currency) }}</span>
        </li>
      </ul>
      <p class="mt-4 text-sm text-petrol-200">Le minimum de transferts pour solder le groupe.</p>
    </section>

    <section v-else-if="showBalances" class="rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-5 text-emerald-900">
      <p class="font-semibold">Tout le monde est à jour.</p>
    </section>

    <ul class="rounded-2xl bg-white ring-1 ring-zinc-200 divide-y divide-zinc-100">
      <li v-for="m in group.members" :key="m.id" class="flex items-center gap-3 px-4 py-3">
        <span class="size-9 shrink-0 grid place-items-center rounded-full bg-petrol-100 text-petrol-800 text-sm font-bold">
          {{ getInitials(m.name) }}
        </span>
        <span class="flex-1 min-w-0">
          <span class="block font-semibold truncate">{{ m.name }}</span>
          <span v-if="showBalances && typeof m.balance === 'number'" class="block text-sm text-zinc-500">
            {{ balanceLabel(m.balance) }}
          </span>
        </span>
        <span
          v-if="showBalances && typeof m.balance === 'number' && m.balance !== 0"
          class="amount font-semibold"
          :class="m.balance > 0 ? 'text-emerald-700' : 'text-zinc-900'"
        >
          {{ m.balance > 0 ? '+' : '' }}{{ formatAmount(m.balance, group.currency) }}
        </span>
      </li>
    </ul>

    <p v-if="!showBalances" class="text-sm text-zinc-600">
      Ce lien montre les membres du groupe, pas les soldes. Les soldes de chacun sont dans l'app Tallyno.
    </p>

    <section v-if="group.shareText">
      <h2 class="mb-2 font-bold">Partager ce bilan</h2>
      <ShareSummary :share-url="shareUrl" :share-text="group.shareText" label="Envoyer dans le groupe" />
    </section>

    <InstallCta text="Avec l'app, tu ajoutes les dépenses et tu suis tous tes groupes." />
  </div>
</template>
