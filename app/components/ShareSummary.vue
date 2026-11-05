<script setup lang="ts">
const props = defineProps<{ shareUrl: string; shareText: string; label?: string }>()

const copied = ref(false)
// The API's share text already ends with the link: do not append it twice.
const waLink = computed(() => {
  const text = props.shareText.includes(props.shareUrl.replace(/^https?:\/\//, '')) ? props.shareText : `${props.shareText}\n${props.shareUrl}`
  return `https://wa.me/?text=${encodeURIComponent(text.trim())}`
})

async function copyLink() {
  try {
    await navigator.clipboard.writeText(props.shareUrl)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
  catch {
    // Clipboard blocked: the WhatsApp button still works.
  }
}
</script>

<template>
  <div class="grid gap-2">
    <a
      :href="waLink"
      target="_blank"
      rel="noopener noreferrer"
      class="flex items-center justify-center gap-2 rounded-full bg-[#17803f] hover:bg-[#146c35] text-white font-semibold px-4 py-3"
    >
      <svg class="size-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.5 5 5.2-1.4A9.9 9.9 0 1 0 12.04 2Zm5.8 14.1c-.25.7-1.45 1.33-2 1.38-.53.08-1.2.11-1.94-.12a17.6 17.6 0 0 1-1.75-.65c-3.08-1.33-5.1-4.44-5.25-4.65-.15-.2-1.25-1.66-1.25-3.17s.79-2.25 1.07-2.56c.28-.3.62-.38.82-.38h.6c.19 0 .45-.07.7.53.25.62.87 2.13.94 2.28.08.16.13.34.03.55-.1.2-.15.33-.3.5l-.46.54c-.15.15-.31.32-.13.62.17.3.78 1.29 1.68 2.09 1.16 1.03 2.13 1.35 2.43 1.5.3.16.48.13.66-.07.18-.21.76-.89.97-1.2.2-.3.4-.25.68-.15.28.1 1.77.84 2.07.99.3.15.5.22.58.35.07.12.07.72-.18 1.42Z" />
      </svg>
      {{ label ?? 'Partager sur WhatsApp' }}
    </a>
    <button
      type="button"
      class="rounded-full px-4 py-3 font-semibold ring-1 ring-zinc-300 text-zinc-700 hover:bg-white"
      @click="copyLink"
    >
      <span aria-live="polite">{{ copied ? 'Lien copié' : 'Copier le lien' }}</span>
    </button>
  </div>
</template>
