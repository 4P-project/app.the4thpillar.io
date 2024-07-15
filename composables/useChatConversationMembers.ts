import type { Address, ConversationHash } from '@4thtech-sdk/types';

export function useChatConversationMembers(conversationHash: ConversationHash) {
  const { chatClient } = useChatClient();

  const PAGE_SIZE = 50n;
  const ORDER = 'asc';

  // State for managing the listener
  const unwatchOnNew = useState<Function | null>('watch-on-member-added-to-conversation', () => null);
  const unwatchOnRemoved = useState<Function | null>('watch-on-member-removed-from-conversation', () => null);

  const fetchPaginated = async (startIndex: bigint, howMany: bigint): Promise<Address[]> => {
    return [...(await chatClient.value.fetchConversationMembersPaginated(conversationHash, startIndex, howMany))];
  };

  const fetchTotalCount = (): Promise<bigint> => {
    return chatClient.value.getConversationMembersCount(conversationHash);
  };

  const pagination = usePaginatedFetch<Address>(fetchPaginated, fetchTotalCount, PAGE_SIZE, ORDER);

  const subscribeToEvents = () => {
    unsubscribeFromEvents();

    unwatchOnNew.value = chatClient.value.onMemberAddedToConversation(
      conversationHash,
      null,
      (_conversationHash, member) => {
        if (!pagination.items.value.includes(member)) {
          pagination.items.value.push(member);
          pagination.totalCount.value += 1n;
        }
      },
    );

    unwatchOnRemoved.value = chatClient.value.onMemberRemovedFromConversation(
      conversationHash,
      null,
      (_conversationHash, member) => {
        if (pagination.items.value.includes(member)) {
          pagination.items.value = pagination.items.value.filter((item) => item !== member);
          pagination.totalCount.value -= 1n;
        }
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
