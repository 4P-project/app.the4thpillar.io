import type { Address } from '@4thtech-sdk/types';
import type { Conversation } from '~/types/chat';

export function useAddChatMembers() {
  const { address } = useAccount();
  const { chatClient } = useChatClient();

  const addMembers = (conversation: Conversation, members: Address[]) => {
    return chatClient.value.addMembersToGroupConversation(conversation.hash, members);
  };

  const canAddMembers = (conversation: Conversation) => {
    const { isGroup, creator, isOnlyCreatorAllowedToAddMembers } = conversation;

    if (!isGroup) {
      return false;
    }

    //  Allow adding members if the current user is the creator or if anyone can add members
    return creator === address.value || !isOnlyCreatorAllowedToAddMembers;
  };

  return {
    addMembers,
    canAddMembers,
  };
}
