import type { ConversationHash, ReceivedMessage, TransactionHash } from '@4thtech-sdk/types';

export function useChatConversationMessages(conversationHash: ConversationHash) {
  const { chatClient } = useChatClient();

  const PAGE_SIZE = 20n;
  const ORDER = 'desc';

  // State for managing the listener
  const unwatchOnNew = useState<Function | null>('watch-on-message-sent', () => null);

  const fetchPaginated = (startIndex: bigint, howMany: bigint): Promise<ReceivedMessage[]> => {
    return chatClient.value.fetchConversationMessagesPaginated(conversationHash, startIndex, howMany);
  };

  const fetchTotalCount = (): Promise<bigint> => {
    return chatClient.value.countMessages(conversationHash);
  };

  const pagination = usePaginatedFetch<ReceivedMessage>(fetchPaginated, fetchTotalCount, PAGE_SIZE, ORDER);

  const removeTmpMessage = (hash: TransactionHash) => {
    const tmpMessageIndex = pagination.items.value.findIndex((message) => message.transactionHash === hash);
    if (tmpMessageIndex !== -1) {
      pagination.items.value.splice(tmpMessageIndex, 1);
    }
  };

  const subscribeToEvents = () => {
    unsubscribeFromEvents();

    unwatchOnNew.value = chatClient.value.onMessageSent(
      null,
      conversationHash,
      null,
      (_conversationHash, receivedMessage) => {
        const messageExists = pagination.items.value.some((message) => message.index === receivedMessage.index);
        if (!messageExists) {
          removeTmpMessage(receivedMessage.transactionHash);
          pagination.items.value.push(receivedMessage);
        }
      },
    );
  };

  const unsubscribeFromEvents = () => {
    unwatchOnNew.value?.();
    unwatchOnNew.value = null;
  };

  // Watch for chatClient changes and reset state if it changes
  watch(
    chatClient,
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
