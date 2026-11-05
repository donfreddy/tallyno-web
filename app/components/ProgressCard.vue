<script setup lang="ts">
import type { RecapProgress as Progress } from '~/types/summary'

/** Group progress without names: safe for links shared to the whole group. */
const props = defineProps<{
  progress: Progress
  pendingAmount: number | null
  currency: string
  /** Tontine rounds count contributions ("cotisations"), expenses count payments. */
  round?: boolean
}>()

const ratio = computed(() => (props.progress.total ? props.progress.confirmed / props.progress.total : 0))
const done = computed(() => props.progress.total > 0 && props.progress.pending === 0)
</script>

<template>
  <section class="rounded-2xl bg-petrol-900 text-white p-5" aria-label="Avancement">
    <p class="text-sm text-petrol-200">
      {{ done ? 'Tout est réglé' : round ? 'Cotisations confirmées' : 'Paiements confirmés' }}
    </p>
    <p class="mt-1 text-3xl font-bold tracking-tight amount">
      {{ progress.confirmed }} <span class="text-petrol-300 font-semibold">sur {{ progress.total }}</span>
    </p>
    <div
      class="mt-4 h-2 rounded-full bg-petrol-700 overflow-hidden"
      role="progressbar"
      :aria-label="round ? 'Cotisations confirmées' : 'Paiements confirmés'"
      :aria-valuenow="progress.confirmed"
      aria-valuemin="0"
      :aria-valuemax="Math.max(progress.total, 1)"
      :aria-valuetext="`${progress.confirmed} sur ${progress.total}`"
    >
      <div class="h-full rounded-full bg-petrol-300" :style="{ width: `${ratio * 100}%` }" />
    </div>
    <p v-if="!done" class="mt-3 text-sm text-petrol-100">
      {{ progress.pending }} en attente<template v-if="pendingAmount !== null">, soit <span class="amount font-semibold">{{ formatAmount(pendingAmount, currency) }}</span></template>
    </p>
  </section>
</template>
