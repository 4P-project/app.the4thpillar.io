<script setup lang="ts">
definePageMeta({
  title: 'Inbox',
  layout: 'empty',
});

const mailStore = useReceivedMailStore();
</script>

<template>
  <MailPane
    :pagination="mailStore.receivedEnvelopes"
    :selected-envelope="mailStore.selectedReceivedEnvelope"
    :envelope-select="(envelope) => (mailStore.selectedReceivedEnvelope = envelope)"
  />
</template>
