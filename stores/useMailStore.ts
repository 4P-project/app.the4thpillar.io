import type { ReceivedEnvelope } from '@4thtech-sdk/types';

export const useMailStore = defineStore('mail', () => {
  const receivedEnvelopes = ref(useReceivedEnvelopes());
  const sentEnvelopes = ref(useSentEnvelopes());
  const selectedReceivedEnvelope = ref<ReceivedEnvelope | null>(null);
  const selectedSentEnvelope = ref<ReceivedEnvelope | null>(null);

  return {
    receivedEnvelopes,
    sentEnvelopes,
    selectedReceivedEnvelope,
    selectedSentEnvelope,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMailStore, import.meta.hot));
}
