<script setup lang="ts">
/** Maps an API error status to the message the visitor needs. */
const props = defineProps<{ status?: number }>()

// Keep the HTTP status honest for crawlers and link previews (410, 404, 502...).
if (import.meta.server) {
  const event = useRequestEvent()
  if (event) setResponseStatus(event, props.status && props.status >= 400 ? props.status : 502)
}

const message = computed(() => {
  if (props.status === 410) {
    return {
      title: 'Ce lien a expiré',
      text: 'Les liens de récap restent ouverts 7 jours. Demande un nouveau lien au groupe, ou retrouve tout dans l\'app.',
    }
  }
  if (props.status === 404) {
    return {
      title: 'Récap introuvable',
      text: 'Ce lien ne correspond à aucun récap. Vérifie qu\'il est complet, ou demande-le à nouveau au groupe.',
    }
  }
  return {
    title: 'Récap indisponible pour le moment',
    text: 'Nous n\'arrivons pas à charger ce récap. Réessaie dans quelques minutes.',
  }
})
</script>

<template>
  <StateMessage :title="message.title" :text="message.text" />
</template>
