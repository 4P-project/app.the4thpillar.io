import type { Address } from '../../4thtech-sdk-js/dist/packages/types';

export function useCreateOneToOneConversation() {
  const { address } = useAccount();
  const { chatClient } = useChatClient();
  const chatStore = useChatStore();

  const createOneToOneConversation = (receiver: Address) => {
    if (!address.value) {
      return;
    }

    // Calculate conversation hash
    const conversationHash = chatClient.value.calculateConversationHash(address.value, receiver);

    // Find conversation
    const conversation = chatStore.getConversation(conversationHash);

    if (conversation) {
      // Select conversation
      chatStore.selectConversation(conversation);
      return;
    }

    // Create new conversation if not exists
    const tmpConversation = {
      hash: conversationHash,
      isGroup: false,
      name: receiver,
      creator: address.value,
      isOnlyCreatorAllowedToAddMembers: false,
      isEncrypted: true,
    };

    chatStore.conversations.items.push(tmpConversation);
    chatStore.selectConversation(tmpConversation);
    chatStore.selectedConversation?.members.items.push(...[address.value, receiver]);
  };

  return {
    createOneToOneConversation,
  };
}
