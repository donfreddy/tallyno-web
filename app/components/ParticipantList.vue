<script setup lang="ts">
import type { RecapParticipant } from '~/types/summary'

/** Names with their status and amount: DETAILED links only. */
defineProps<{ participants: RecapParticipant[]; currency: string }>()
</script>

<template>
  <ul class="rounded-2xl bg-white ring-1 ring-zinc-200 divide-y divide-zinc-100">
    <li v-for="p in participants" :key="p.id" class="flex items-center gap-3 px-4 py-3">
      <span class="size-9 shrink-0 grid place-items-center rounded-full bg-petrol-100 text-petrol-800 text-sm font-bold">
        {{ getInitials(p.name) }}
      </span>
      <span class="flex-1 min-w-0">
        <span class="block font-semibold truncate">{{ p.name }}</span>
        <span class="block text-sm" :class="p.settled ? 'text-emerald-700' : 'text-zinc-500'">
          {{ p.settled ? 'Confirmé' : 'En attente' }}
        </span>
      </span>
      <span v-if="typeof p.amount === 'number'" class="amount font-semibold">
        {{ formatAmount(p.amount, currency) }}
      </span>
    </li>
  </ul>
</template>
