import type { ConversationHash } from '@4thtech-sdk/types';
import type { Conversation } from '~/types/chat';

export function useChatConversations() {
  const { chatClient } = useChatClient();
  const { address } = useAccount();

  const PAGE_SIZE = 50n;
  const ORDER = 'desc';

  // State for managing the listener
  const unwatchOnNew = useState<Function | null>('watch-on-conversation-added', () => null);
  const unwatchOnRemoved = useState<Function | null>('watch-on-conversation-removed', () => null);

  const fetchPaginated = (startIndex: bigint, howMany: bigint): Promise<Conversation[]> => {
    return chatClient.value.fetchConversationsPaginated(address.value, startIndex, howMany);
  };

  const fetchSingle = (conversationHash: ConversationHash): Promise<Conversation> => {
    return chatClient.value.fetchConversation(conversationHash);
  };

  const fetchTotalCount = (): Promise<bigint> => {
    return chatClient.value.getConversationsCount(address.value);
  };

  const pagination = usePaginatedFetch<Conversation>(fetchPaginated, fetchTotalCount, PAGE_SIZE, ORDER);

  const subscribeToEvents = () => {
    unsubscribeFromEvents();

    unwatchOnNew.value = chatClient.value.onMemberAddedToConversation(
      null,
      address.value,
      async (conversationHash, _member) => {
        if (!pagination.items.value.some((conversation) => conversation.hash === conversationHash)) {
          const conversation = await fetchSingle(conversationHash);
          pagination.items.value.push(conversation);
        }
      },
    );

    unwatchOnRemoved.value = chatClient.value.onMemberRemovedFromConversation(
      null,
      address.value,
      (conversationHash, _member) => {
        pagination.items.value = pagination.items.value.filter(
          (conversation) => conversation.hash !== conversationHash,
        );
      },
    );
  };

  const unsubscribeFromEvents = () => {
    unwatchOnNew.value?.();
    unwatchOnNew.value = null;

    unwatchOnRemoved.value?.();
    unwatchOnRemoved.value = null;
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
