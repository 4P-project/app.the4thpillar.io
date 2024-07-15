import type { ReceivedEnvelope } from '@4thtech-sdk/types';

export const useReceivedMailStore = defineStore('mail-received', () => {
  const receivedEnvelopes = ref(useReceivedEnvelopes());
  const selectedReceivedEnvelope = ref<ReceivedEnvelope | null>(null);

  return {
    receivedEnvelopes,
    selectedReceivedEnvelope,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useReceivedMailStore, import.meta.hot));
}
