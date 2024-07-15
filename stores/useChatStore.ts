import type { Conversation } from '~/types/chat';

export const useChatStore = defineStore('chat', () => {
  const { chatClient } = useChatClient();

  const conversations = ref(useChatConversations());
  const selectedConversation = ref<Conversation | null>(null);

  watch(
    chatClient,
    (newClient, oldClient) => {
      if (newClient !== oldClient) {
        selectedConversation.value = null;
      }
    },
    { immediate: true },
  );

  const getConversation = (hash: string): Conversation | null => {
    return conversations.value.items.find((conversation) => conversation.hash === hash) || null;
  };

  function selectConversation(conversation: Conversation) {
    conversation.messages = useChatConversationMessages(conversation.hash);
    conversation.members = useChatConversationMembers(conversation.hash);

    selectedConversation.value = conversation;
  }

  return {
    conversations,
    selectedConversation,
    getConversation,
    selectConversation,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useChatStore, import.meta.hot));
}
