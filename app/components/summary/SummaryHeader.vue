<script setup lang="ts">
import type { ExpenseRecap } from '~/types/summary'

const props = defineProps<{ expense: ExpenseRecap }>()

const round = computed(() => props.expense.round)
const total = computed(() => formatAmount(props.expense.totalAmount, props.expense.currency))
</script>

<template>
  <header >
    <p class="text-sm font-semibold text-petrol-700">{{ expense.groupName }}</p>

    <template v-if="round">
      <h1 class="mt-1 text-3xl font-bold tracking-tight">Tour {{ round.roundNumber }}</h1>
      <p class="mt-1 text-zinc-600">
        Reçu par <strong class="text-zinc-900">{{ expense.payerName }}</strong>,
        à payer avant le {{ formatDate(round.dueDate) }}.
      </p>
    </template>

    <template v-else>
      <h1 class="mt-1 text-3xl font-bold tracking-tight">{{ expense.description }}</h1>
      <p class="mt-1 text-zinc-600">
        <span class="amount font-semibold text-zinc-900">{{ total }}</span>,
        avancés par <strong class="text-zinc-900">{{ expense.payerName }}</strong>
        le {{ formatDate(expense.date) }}.
      </p>
    </template>

    <p v-if="expense.amendmentCount > 0" class="mt-2 text-sm text-zinc-600">
      Corrigée {{ expense.amendmentCount }} fois. L'historique des corrections est dans l'app.
    </p>
  </header>
</template>
