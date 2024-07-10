import type { Conversation } from '~/types/chat';

export function useChatConversationName(conversation: Conversation) {
  const { address } = useAccount();

  const getOneToOneConversationReceiver = () => {
    const members = conversation.members.items;
    return members.find((member) => member !== address.value);
  };

  return conversation.isGroup ? conversation.name : getOneToOneConversationReceiver() || '';
}
