<script setup lang="ts">
/** A value with a copy button, for numbers people retype in their Mobile Money app. */
const props = defineProps<{ label: string; display: string; value: string }>()

const copied = ref(false)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.value)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    // Clipboard blocked (insecure context, old browser): the value stays visible.
  }
}
</script>

<template>
  <div class="flex items-center justify-between gap-3 py-3">
    <div class="min-w-0">
      <p class="text-sm text-zinc-500">{{ label }}</p>
      <p class="amount text-lg font-semibold">{{ display }}</p>
    </div>
    <button
      type="button"
      class="shrink-0 rounded-full px-3.5 py-1.5 text-sm font-semibold ring-1 ring-petrol-200 text-petrol-700 hover:bg-petrol-50"
      @click="copy"
    >
      <span aria-live="polite">{{ copied ? 'Copié' : 'Copier' }}</span>
    </button>
  </div>
</template>
