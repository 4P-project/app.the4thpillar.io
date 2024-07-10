<script setup lang="ts">
definePageMeta({
  title: 'Sent',
  layout: 'empty',
});

const mailStore = useMailStore();
</script>

<template>
  <MailPane
    :pagination="mailStore.sentEnvelopes"
    :selected-envelope="mailStore.selectedSentEnvelope"
    :envelope-select="(envelope) => (mailStore.selectedSentEnvelope = envelope)"
  />
</template>
