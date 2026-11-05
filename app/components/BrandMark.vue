<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 28 })
</script>

<template>
  <span
    class="inline-grid place-items-center rounded-[28%] bg-petrol-600 shrink-0"
    :style="{ width: `${size}px`, height: `${size}px` }"
    aria-hidden="true"
  >
    <svg viewBox="261 197 501 629" fill="#fff" :style="{ width: `${size * 0.48}px` }">
      <path d="M261 197H535A28 28 0 0 1 563 225V826H470A45 45 0 0 1 425 781V306H288A27 27 0 0 1 261 279Z" />
      <path d="M599 197H735A27 27 0 0 1 762 224V306H599Z" />
    </svg>
  </span>
</template>
