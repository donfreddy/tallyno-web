<script setup lang="ts">
import type { ExpenseSummary } from '~/composables/useFakeData'
import { formatAmount, formatDate } from '~/composables/useFakeData'

const props = defineProps<{ expense: ExpenseSummary }>()

const date = computed(() => formatDate(props.expense.date))
const total = computed(() => formatAmount(props.expense.totalAmount, props.expense.currency))
const confirmedCount = computed(() => props.expense.participants.filter(p => p.settled).length)
const pendingCount   = computed(() => props.expense.participants.filter(p => !p.settled).length)
const pendingAmount  = computed(() =>
  props.expense.participants.filter(p => !p.settled).reduce((s, p) => s + p.amount, 0)
)
</script>

<template>
  <div class="animate-slide-up">
    <!-- Pill catégorie -->
    <div class="flex items-center gap-2 mb-3">
      <span class="text-2xl leading-none">{{ expense.categoryEmoji }}</span>
      <span class="text-xs font-medium text-zinc-500 bg-zinc-100 rounded-full px-2.5 py-1">
        {{ expense.groupName }}
      </span>
      <span
        v-if="expense.status === 'LOCKED'"
        class="text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full px-2.5 py-1"
      >
        Verrouillée
      </span>
    </div>

    <!-- Description + montant -->
    <h1 class="text-2xl font-bold text-zinc-900 tracking-tight leading-snug">
      {{ expense.description }}
    </h1>

    <div class="mt-1 flex items-baseline gap-2">
      <span class="text-3xl font-bold text-brand-500 font-mono tracking-tight">
        {{ total }}
      </span>
    </div>

    <!-- Payeur + date -->
    <p class="mt-2 text-sm text-zinc-500">
      Payé par <span class="font-semibold text-zinc-700">{{ expense.payerName }}</span>
      · {{ date }}
    </p>

    <!-- Statut pills -->
    <div class="mt-4 flex flex-wrap gap-2">
      <div
        v-if="confirmedCount > 0"
        class="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1.5"
      >
        <span class="text-emerald-500 text-sm">✅</span>
        <span class="text-xs font-medium text-emerald-700">
          {{ confirmedCount }} confirmé{{ confirmedCount > 1 ? 's' : '' }}
        </span>
      </div>
      <div
        v-if="pendingCount > 0"
        class="flex items-center gap-1.5 bg-amber-50 border border-amber-200 rounded-full px-3 py-1.5"
      >
        <span class="text-amber-500 text-sm">⏳</span>
        <span class="text-xs font-medium text-amber-700">
          {{ formatAmount(pendingAmount, expense.currency) }} en attente
        </span>
      </div>
      <div
        v-if="expense.amendmentCount > 0"
        class="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1.5"
      >
        <span class="text-blue-500 text-sm">✏️</span>
        <span class="text-xs font-medium text-blue-700">
          {{ expense.amendmentCount }} correction{{ expense.amendmentCount > 1 ? 's' : '' }}
        </span>
      </div>
    </div>
  </div>
</template>