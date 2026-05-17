<script setup lang="ts">
useSeoMeta({
  title: 'Tallyno · Dépenses partagées sans disputes',
  description: 'Gérez vos dépenses de groupe, partagez des résumés sur WhatsApp et remboursez facilement via Mobile Money.',
  ogTitle: 'Tallyno — Dépenses partagées sans disputes',
  ogDescription: 'La fin du chaos dans vos groupes WhatsApp. Dépenses, remboursements, Mobile Money.',
  ogImage: 'https://tallyno.app/og-default.png',
})

const features = [
  { emoji: '📊', title: 'Calcul automatique', desc: 'Tallyno calcule qui doit quoi. Plus jamais de tableau Excel.' },
  { emoji: '📲', title: 'WhatsApp-first', desc: 'Partagez le résumé dans votre groupe WhatsApp en un clic.' },
  { emoji: '💸', title: 'Mobile Money', desc: 'Payez via MTN ou Orange. L\'argent va directement au créancier.' },
  { emoji: '🔒', title: 'Incontestable', desc: 'Chaque modification est tracée. Les disputes, c\'est fini.' },
]

const steps = [
  { num: '01', title: 'Freddy crée le groupe', desc: 'Il ajoute ses amis par numéro de téléphone, même sans compte.' },
  { num: '02', title: 'Il saisit les dépenses', desc: 'Chaque repas, transport, hôtel - Tallyno calcule les parts automatiquement.' },
  { num: '03', title: 'Il partage le résumé', desc: 'Un clic pour envoyer le bilan dans le groupe WhatsApp. Tout le monde voit sa part.' },
  { num: '04', title: 'Chacun rembourse', desc: 'Un lien MTN ou Orange pré-rempli. L\'argent part directement. Tallyno ne touche pas aux fonds.' },
]
</script>

<template>
  <div class="max-w-lg mx-auto px-4 pb-16">

    <!-- Hero -->
    <section class="pt-12 pb-10 text-center animate-slide-up">
      <UBadge color="success" variant="outline"
        class="rounded-full gap-2 bg-emerald-50 border-emerald-200 inline-flex items-center mb-4">
        <span class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Nouveau</span>
        <span class="text-xs text-emerald-700">Résumés WhatsApp automatiques</span>
      </UBadge>

      <h1 class="text-4xl font-bold text-zinc-900 tracking-tight leading-tight mb-4">
        Dépenses partagées<br>
        <span class="text-purple-800">sans disputes</span>
      </h1>

      <p class="text-base text-zinc-500 leading-relaxed mb-8 max-w-sm mx-auto">
        Tallyno calcule les parts, partage les résumés sur WhatsApp et connecte à Mobile Money.
        En 1 clic.
      </p>

      <!-- CTA buttons -->
      <div class="flex flex-col gap-3 max-w-xs mx-auto" id="download">
        <a href="#"
          class="flex items-center justify-center gap-3 bg-purple-800 text-white rounded-2xl px-4 py-3 font-semibold hover:bg-purple-700 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          Télécharger pour iPhone
        </a>
        <a href="#"
          class="flex items-center justify-center gap-3 bg-white border border-zinc-200 text-zinc-800 rounded-2xl px-4 py-3 font-semibold hover:bg-zinc-50 transition-colors">
          <svg class="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M3.18 23.76c.28.15.6.19.92.1l12.82-7.41-2.79-2.79-10.95 10.1zM.39 1.33C.14 1.62 0 2.05 0 2.61v18.78c0 .56.14.99.4 1.28l.07.06 10.51-10.51v-.25L.46 1.27l-.07.06zM20.07 9.74L16.94 8l-3.06 3.06 3.06 3.07 3.14-1.76c.9-.5.9-1.32 0-1.63zM3.18.24L16 7.65 13.21 10.44 2.26.34C2.54.23 2.9.09 3.18.24z" />
          </svg>
          Télécharger pour Android
        </a>
      </div>

      <!-- Social proof -->
      <div class="mt-6 flex items-center justify-center gap-2 text-xs text-zinc-400">
        <div class="flex -space-x-1.5">
          <div v-for="color in ['bg-violet-400', 'bg-blue-400', 'bg-emerald-400', 'bg-amber-400']" :key="color"
            class="w-6 h-6 rounded-full border-2 border-white" :class="color" />
        </div>
        <span><strong>+500</strong> groupes actifs sur Tallyno</span>
      </div>
    </section>

    <!-- Demo summary card -->
    <section class="animate-slide-up delay-100 mb-10">
      <div class="bg-white rounded-3xl border border-zinc-100 shadow-lg shadow-zinc-100 overflow-hidden">
        <!-- Fausse barre de navigateur -->
        <div class="bg-zinc-100 border-b border-zinc-100 px-4 py-2.5 flex items-center gap-2">
          <div class="flex gap-1.5">
            <div class="w-3 h-3 rounded-full bg-red-300" />
            <div class="w-3 h-3 rounded-full bg-amber-300" />
            <div class="w-3 h-3 rounded-full bg-emerald-300" />
          </div>
          <div
            class="flex-1 bg-white rounded-md px-3 py-1 text-xs text-zinc-400 font-mono text-center border border-zinc-200">
            tallyno.app/s/abc123
          </div>
        </div>

        <!-- Mini-summary -->
        <div class="p-5 space-y-3">
          <div class="flex items-start gap-3">
            <span class="text-2xl">🍔</span>
            <div>
              <p class="font-bold text-zinc-900">Opiom Bonamoussadi</p>
              <p class="text-xs text-zinc-500">Payé par Freddy • Samedi soir</p>
            </div>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-2xl font-bold font-mono text-brand-500">32 000 FCFA</span>
            <div class="flex gap-1.5">
              <span
                class="text-[10px] font-medium bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full px-2 py-0.5">✅
                1 confirmé</span>
              <span
                class="text-[10px] font-medium bg-amber-50 text-amber-600 border border-amber-200 rounded-full px-2 py-0.5">⏳
                3 en attente</span>
            </div>
          </div>

          <!-- Participants mini-list -->
          <div class="space-y-2">
            <div v-for="(p, i) in [
              { name: 'Freddy', settled: true },
              { name: 'Marie', settled: true },
              { name: 'Paul', settled: false },
              { name: 'Kevin', settled: false },
            ]" :key="i" class="flex items-center gap-2.5">
              <div class="w-7 h-7 rounded-full text-white text-xs font-bold flex items-center justify-center"
                :class="['bg-violet-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500'][i]">
                {{ p.name[0] }}
              </div>
              <span class="text-xs font-medium text-zinc-700 flex-1">{{ p.name }}</span>
              <span class="text-xs" :class="p.settled ? 'text-emerald-500' : 'text-amber-500'">
                {{ p.settled ? '✅ Confirmé' : '⏳ En attente' }}
              </span>
            </div>
          </div>

          <!-- CTA WhatsApp -->
          <div class="pt-1">
            <UButton label="Partager sur WhatsApp" color="success" variant="solid"
              class="rounded-xl cursor-pointer transition-colors" size="lg" block />
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-zinc-900 text-center mb-2">
        Pourquoi Tallyno ?
      </h2>
      <p class="text-sm text-zinc-500 text-center mb-7">
        Conçu pour les groupes africains, bâti pour durer.
      </p>

      <div class="grid grid-cols-2 gap-3">
        <div v-for="(f, i) in features" :key="i"
          class="bg-white rounded-2xl border border-zinc-100 p-4 animate-slide-up" :class="`delay-${(i + 1) * 100}`">
          <div class="text-2xl mb-2">{{ f.emoji }}</div>
          <h3 class="text-sm font-bold text-zinc-800 mb-1">{{ f.title }}</h3>
          <p class="text-xs text-zinc-500 leading-relaxed">{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- How it works -->
    <section class="mb-12">
      <h2 class="text-2xl font-bold text-zinc-900 text-center mb-6">
        Comment ça marche ?
      </h2>

      <div class="space-y-4">
        <div v-for="(step, i) in steps" :key="i" class="flex gap-4 animate-slide-up" :class="`delay-${(i + 1) * 100}`">
          <div
            class="shrink-0 w-10 h-10 rounded-xl bg-purple-50 border border-purple-200 flex items-center justify-center">
            <span class="text-xs font-bold font-mono text-purple-700">{{ step.num }}</span>
          </div>
          <div class="pt-1">
            <h3 class="text-sm font-bold text-zinc-800 mb-0.5">{{ step.title }}</h3>
            <p class="text-xs text-zinc-500 leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- WhatsApp summary example -->
    <section class="mb-12 animate-slide-up">
      <h2 class="text-2xl font-bold text-zinc-900 text-center mb-2">
        Le résumé WhatsApp
      </h2>
      <p class="text-sm text-zinc-500 text-center mb-6">
        Partagé en un clic dans votre groupe. Tout le monde comprend instantanément.
      </p>

      <!-- Faux message WhatsApp -->
      <div class="bg-[#0B141A] rounded-3xl overflow-hidden p-4 space-y-3">
        <!-- Header WA -->
        <div class="flex items-center gap-3 pb-3 border-b border-white/10">
          <div
            class="w-9 h-9 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-sm">F
          </div>
          <div>
            <p class="text-white text-sm font-semibold">Les Potes 🔥</p>
            <p class="text-[11px] text-white/50">4 membres</p>
          </div>
        </div>

        <!-- Message WA -->
        <div class="flex justify-end">
          <div class="bg-[#005C4B] rounded-2xl rounded-tr-sm px-3 py-2.5 max-w-[85%]">
            <pre class="text-white text-[11px] leading-relaxed font-mono whitespace-pre-wrap">🍔 Opiom Bonamoussadi - Samedi soir

Total : 32 000 FCFA • Payé par Freddy
✅ 1 paiement confirmé
⏳ 3 paiements en attente • 24 000 FCFA restants

📲 Voir ta part → tallyno.app/s/abc123/me
─────────────────────────────
Géré avec <span class="font-medium">Tallyno</span></pre>
            <p class="text-white/40 text-[10px] text-right mt-1">20:32 ✓✓</p>
          </div>
        </div>

        <!-- Réaction -->
        <div class="flex justify-start gap-2">
          <div class="bg-[#202C33] rounded-full px-3 py-1.5">
            <span class="text-white text-xs">👍 3</span>
          </div>
          <div class="bg-[#202C33] rounded-full px-3 py-1.5">
            <span class="text-white text-xs">🙏 2</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="text-center animate-slide-up">
      <h2 class="text-2xl font-bold text-zinc-900 mb-3">
        Prêt à simplifier vos dépenses ?
      </h2>
      <p class="text-sm text-zinc-500 mb-6">
        Gratuit. Aucune carte bancaire requise.
      </p>

      <div class="flex flex-col gap-3 max-w-xs mx-auto">
        <UButton label="Télécharger Tallyno - Gratuit" size="xl" color="primary" variant="solid"
          class="rounded-2xl cursor-pointer px-4 py-3 bg-purple-800 font-semibold hover:bg-purple-700 transition-colors"
          block />
        <p class="text-xs text-zinc-400">
          Disponible sur iOS & Android · Cameroun, Nigéria
        </p>
      </div>
    </section>

  </div>
</template>