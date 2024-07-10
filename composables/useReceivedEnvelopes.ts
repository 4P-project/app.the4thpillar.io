import type { ReceivedEnvelope } from '@4thtech-sdk/types';
import { useToast } from 'vue-toastification';

export function useReceivedEnvelopes() {
  const { mailClient } = useMailClient();
  const { address } = useAccount();
  const toast = useToast();

  const PAGE_SIZE = 10n;
  const ORDER = 'desc';

  // State for managing the listener
  const unwatchOnNew = useState<Function | null>('watch-on-received-envelope', () => null);

  const fetchPaginated = (startIndex: bigint, howMany: bigint): Promise<ReceivedEnvelope[]> => {
    return mailClient.value.fetchPaginated(address.value, startIndex, howMany);
  };

  const fetchTotalCount = (): Promise<bigint> => {
    return mailClient.value.count(address.value);
  };

  const pagination = usePaginatedFetch<ReceivedEnvelope>(fetchPaginated, fetchTotalCount, PAGE_SIZE, ORDER);

  const subscribeToEvents = () => {
    unsubscribeFromEvents();

    unwatchOnNew.value = mailClient.value.onNew(null, address.value, (receivedEnvelope: ReceivedEnvelope) => {
      if (!pagination.items.value.some((envelope) => envelope.index === receivedEnvelope.index)) {
        pagination.items.value.push(receivedEnvelope);
        toast.info('New mail in inbox.', { timeout: 10_000 });
      }
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
