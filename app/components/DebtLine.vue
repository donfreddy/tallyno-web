<script setup lang="ts">
import type { PublicParticipant } from '~/types/summary'

const props = defineProps<{
  participant: PublicParticipant
  currency: string
  showAmount: boolean   // false en mode SOCIAL (privacy)
}>()
</script>

<template>
  <div class="flex items-center gap-3 py-3 animate-slide-up" :class="participant.isMe ? 'opacity-100' : 'opacity-90'">
    <!-- Avatar -->
    <div class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
      :class="getAvatarColor(participant.name)">
      {{ getInitials(participant.name) }}
    </div>

    <!-- Nom + sous-texte -->
    <div class="flex-1 min-w-0">
      <div class="flex items-center gap-1.5">
        <span class="text-sm font-semibold text-slate-800 truncate">
          {{ participant.name }}
        </span>
        <span v-if="participant.isMe"
          class="text-[10px] font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-full px-2 py-0.5 shrink-0">
          toi
        </span>
      </div>
      <p v-if="participant.settled" class="text-xs text-emerald-600 font-medium mt-0.5">
        Paiement confirmé ✓
      </p>
      <p v-else class="text-xs text-slate-400 mt-0.5">
        En attente...
      </p>
    </div>

    <!-- Montant + statut -->
    <div class="text-right shrink-0">
      <span v-if="showAmount" class="text-sm font-bold font-mono"
        :class="participant.settled ? 'text-emerald-600' : 'text-slate-700'">
        {{ formatAmount(participant.amount, currency) }}
      </span>

      <!-- Indicateur de statut -->
      <div class="flex justify-end mt-1">
        <div class="w-2 h-2 rounded-full"
          :class="participant.settled ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'" />
      </div>
    </div>
  </div>
</template>