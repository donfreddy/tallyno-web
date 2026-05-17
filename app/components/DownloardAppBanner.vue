<script setup lang="ts">
defineProps<{ compact?: boolean }>()
</script>

<template>
  <div class="animate-slide-up delay-300 rounded-2xl overflow-hidden"
    :class="compact ? 'bg-zinc-50 border border-zinc-200' : 'bg-brand-900'">
    <div class="px-4 py-4 flex items-center gap-4">
      <!-- Icon -->
      <div class="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shrink-0">
        <span class="text-white text-lg font-bold font-mono">T</span>
      </div>

      <!-- Text -->
      <div class="flex-1 min-w-0">
        <p class="text-sm font-semibold leading-tight" :class="compact ? 'text-zinc-800' : 'text-white'">
          Gère tes dépenses avec Tallyno
        </p>
        <p class="text-xs mt-0.5" :class="compact ? 'text-zinc-500' : 'text-zinc-400'">
          Groupes · Remboursements · Plus de disputes
        </p>
      </div>

      <!-- Button -->
      <a href="#download" class="shrink-0 text-xs font-semibold rounded-xl px-3 py-2 transition-all" :class="compact
        ? 'bg-brand-500 text-white hover:bg-brand-600'
        : 'bg-white text-brand-900 hover:bg-zinc-100'">
        Télécharger
      </a>
    </div>
  </div>
</template>