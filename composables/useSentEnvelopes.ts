import type { ReceivedEnvelope } from '@4thtech-sdk/types';

export function useSentEnvelopes() {
  const { mailClient } = useMailClient();
  const { address } = useAccount();

  const PAGE_SIZE = 10n;
  const ORDER = 'desc';

  // State for managing the listener
  const unwatchOnNew = useState<Function | null>('watch-on-sent-envelope', () => null);

  const fetchPaginated = (_startIndex: bigint, _howMany: bigint): Promise<ReceivedEnvelope[]> => {
    return mailClient.value.fetchSentMails(address.value);
  };

  const fetchTotalCount = (): Promise<bigint> => {
    return Promise.resolve(1n);
  };

  const pagination = usePaginatedFetch<ReceivedEnvelope>(fetchPaginated, fetchTotalCount, PAGE_SIZE, ORDER);

  const subscribeToEvents = () => {
    unsubscribeFromEvents();

    unwatchOnNew.value = mailClient.value.onNew(address.value, null, (envelope: ReceivedEnvelope) => {
      pagination.items.value.push(envelope);
    });
  };

  const unsubscribeFromEvents = () => {
    unwatchOnNew.value?.();
    unwatchOnNew.value = null;
  };

  // Watch for mailClient changes and reset state if it changes
  watch(
    mailClient,
    async (newClient, oldClient) => {
      if (newClient !== oldClient) {
        await pagination.reset();
        subscribeToEvents();
      }
    },
    { immediate: true },
  );

  return pagination;
}
