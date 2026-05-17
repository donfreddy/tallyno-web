<template>
  <div class="animate-pulse space-y-4 px-4 pt-6">
    <!-- Header skeleton -->
    <div class="space-y-3">
      <div class="flex gap-2">
        <div class="w-8 h-8 bg-zinc-200 rounded-full" />
        <div class="h-6 bg-zinc-200 rounded-full w-24" />
      </div>
      <div class="h-7 bg-zinc-200 rounded-xl w-48" />
      <div class="h-9 bg-zinc-100 rounded-xl w-32" />
      <div class="h-4 bg-zinc-100 rounded-full w-40" />
      <div class="flex gap-2 mt-2">
        <div class="h-7 bg-emerald-100 rounded-full w-28" />
        <div class="h-7 bg-amber-100 rounded-full w-32" />
      </div>
    </div>

    <!-- Divider -->
    <div class="h-px bg-zinc-100" />

    <!-- Participant rows skeleton -->
    <div class="space-y-1">
      <div v-for="i in 4" :key="i" class="flex items-center gap-3 py-2">
        <div class="w-9 h-9 bg-zinc-200 rounded-full shrink-0" />
        <div class="flex-1 space-y-1.5">
          <div class="h-3.5 bg-zinc-200 rounded-full w-20" />
          <div class="h-3 bg-zinc-100 rounded-full w-14" />
        </div>
        <div class="space-y-1.5 items-end flex flex-col">
          <div class="h-3.5 bg-zinc-200 rounded-full w-16" />
          <div class="w-2 h-2 bg-zinc-200 rounded-full" />
        </div>
      </div>
    </div>

    <!-- CTA skeleton -->
    <div class="space-y-2 pt-2">
      <div class="h-12 bg-yellow-100 rounded-xl" />
      <div class="h-12 bg-orange-100 rounded-xl" />
      <div class="h-12 bg-blue-100 rounded-xl" />
    </div>
  </div>
</template>