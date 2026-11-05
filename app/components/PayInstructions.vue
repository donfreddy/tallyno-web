<script setup lang="ts">
import { dialablePhone, formatPhone } from '~/utils/summary-view'

/**
 * How to pay, without pretending to open Mobile Money apps: MTN MoMo and
 * Orange Money expose no public deep link, so we hand over what to type.
 */
const props = defineProps<{ payeeName: string; payeePhone: string; amount?: number; currency: string }>()
</script>

<template>
  <section class="rounded-2xl bg-white ring-1 ring-zinc-200 px-4 pt-3 pb-4">
    <h2 class="font-bold">Payer {{ payeeName }}</h2>
    <p class="text-sm text-zinc-600">Par MTN MoMo ou Orange Money, depuis ton téléphone.</p>
    <div class="mt-1 divide-y divide-zinc-100">
      <CopyField label="Numéro Mobile Money" :display="formatPhone(props.payeePhone)" :value="dialablePhone(props.payeePhone)" />
      <CopyField
        v-if="typeof amount === 'number'"
        label="Montant"
        :display="formatAmount(amount, currency)"
        :value="String(amount)"
      />
    </div>
    <p class="mt-2 text-sm text-zinc-500">L'argent va directement à {{ payeeName }}. Tallyno ne le reçoit jamais.</p>
  </section>
</template>
