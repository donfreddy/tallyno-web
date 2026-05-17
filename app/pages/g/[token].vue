<script setup lang="ts">
import { useFakeData, formatAmount, getInitials, getAvatarColor } from '~/composables/useFakeData'

const route = useRoute()
const token = route.params.token as string
const { getGroupByToken } = useFakeData()

const { data: group, pending, error } = await useAsyncData(
  `group-${token}`,
  () => getGroupByToken(token),
)

useSeoMeta({
  title: () => group.value ? `Bilan · ${group.value.name}` : 'Tallyno',
  ogTitle: () => group.value ? `📊 ${group.value.name} — Bilan des dépenses` : 'Tallyno',
  ogDescription: () => group.value
    ? `${formatAmount(group.value.totalExpenses, group.value.currency)} dépensés · ${group.value.memberCount} membres`
    : '',
})

const shareUrl = `https://tallyno.app/g/${token}`
const shareText = computed(() => {
  if (!group.value) return ''
  const debts = group.value.simplifiedDebts
    .map(d => `  ${d.fromName} → ${d.toName} : ${formatAmount(d.amount, group.value!.currency)}`)
    .join('\n')
  return `📊 Groupe "${group.value.name}" — Bilan\n\n💰 Total : ${formatAmount(group.value.totalExpenses, group.value.currency)}\n\n💸 Pour solder :\n${debts}`
})

// Couleur du badge de balance
function balanceColor(balance: number) {
  if (balance > 0) return 'text-emerald-600 bg-emerald-50 border-emerald-200'
  if (balance < 0) return 'text-red-500 bg-red-50 border-red-200'
  return 'text-zinc-500 bg-zinc-50 border-zinc-200'
}

function balanceSign(balance: number) {
  if (balance > 0) return '+'
  return ''
}
</script>

<template>
  <div class="max-w-lg mx-auto px-4 pb-8 pt-5">

    <SummarySkeleton v-if="pending" />
    <TokenExpired v-else-if="error?.statusCode === 410" />
    <SummaryError v-else-if="error" />

    <template v-else-if="group">

      <!-- Header groupe -->
      <div class="animate-slide-up">
        <div class="flex items-center gap-2 mb-3">
          <span class="text-xs font-medium text-zinc-500 bg-zinc-100 rounded-full px-2.5 py-1">
            📊 Bilan du groupe
          </span>
        </div>
        <h1 class="text-2xl font-bold text-zinc-900 tracking-tight">
          {{ group.name }}
        </h1>
        <p class="text-sm text-zinc-500 mt-1">
          {{ group.memberCount }} membres •
          <span class="font-mono font-semibold text-purple-500">
            {{ formatAmount(group.totalExpenses, group.currency) }}
          </span>
          dépensés au total
        </p>
      </div>

      <!-- Positions nettes -->
      <div class="mt-5 animate-slide-up delay-100">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Positions nettes
        </p>
        <div class="bg-white rounded-2xl border border-zinc-100 shadow-sm divide-y divide-zinc-50 overflow-hidden">
          <div v-for="m in group.members" :key="m.id" class="flex items-center gap-3 px-4 py-3.5">
            <!-- Avatar -->
            <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
              :class="getAvatarColor(m.name)">
              {{ getInitials(m.name) }}
            </div>

            <!-- Nom -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="text-sm font-semibold text-zinc-800">{{ m.name }}</span>
                <span v-if="m.isMe"
                  class="text-[10px] font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5">
                  toi
                </span>
              </div>
              <p class="text-xs text-zinc-400 mt-0.5">
                {{ m.balance > 0 ? 'À recevoir' : m.balance < 0 ? 'À rembourser' : 'Soldé ✓' }} </p>
            </div>

            <!-- Balance badge -->
            <UBadge class="font-mono font-bold border rounded-lg" :class="balanceColor(m.balance)">
              {{ balanceSign(m.balance) }}{{ formatAmount(Math.abs(m.balance), group.currency) }}
            </UBadge>
          </div>
        </div>
      </div>

      <!-- Dettes simplifiées -->
      <div v-if="group.simplifiedDebts.length > 0" class="mt-5 animate-slide-up delay-200">
        <p class="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
          Pour solder le groupe
        </p>
        <div class="space-y-2">
          <div v-for="(d, i) in group.simplifiedDebts" :key="i"
            class="flex items-center gap-3 bg-white rounded-xl border border-zinc-100 shadow-sm px-4 py-3.5">
            <div class="flex-1 flex items-center gap-2 min-w-0">
              <span class="text-sm font-semibold text-zinc-700 truncate">{{ d.fromName }}</span>
              <svg class="w-4 h-4 text-zinc-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
              <span class="text-sm font-semibold text-zinc-700 truncate">{{ d.toName }}</span>
            </div>
            <span class="font-mono font-bold text-sm text-brand-500 shrink-0">
              {{ formatAmount(d.amount, group.currency) }}
            </span>
          </div>
        </div>
        <p class="text-[11px] text-zinc-400 text-center mt-2">
          Minimum de virements pour solder tout le groupe
        </p>
      </div>

      <!-- Séparateur -->
      <div class="my-5 h-px bg-zinc-100" />

      <!-- Partage -->
      <div class="animate-slide-up delay-300">
        <p class="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Partager le bilan
        </p>
        <ShareSummary :share-url="shareUrl" :share-text="shareText" label="Envoyer le bilan sur WhatsApp" />
      </div>

      <!-- Séparateur -->
      <div class="my-5 h-px bg-zinc-100" />

      <DownloadAppBanner />
      <SummaryFooter class="mt-4" />

    </template>
  </div>
</template>