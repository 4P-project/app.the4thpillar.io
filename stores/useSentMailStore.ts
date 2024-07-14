import type { ReceivedEnvelope } from '@4thtech-sdk/types';

export const useSentMailStore = defineStore('mail-sent', () => {
  const sentEnvelopes = ref(useSentEnvelopes());
  const selectedSentEnvelope = ref<ReceivedEnvelope | null>(null);

  return {
    sentEnvelopes,
    selectedSentEnvelope,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useSentMailStore, import.meta.hot));
}
