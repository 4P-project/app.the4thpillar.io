import type { Address } from '@4thtech-sdk/types';
import { useToast } from 'vue-toastification';
import type { Conversation } from '~/types/chat';

export function useRemoveChatMembers() {
  const { address } = useAccount();
  const { chatClient } = useChatClient();
  const toast = useToast();

  const removeMember = (conversation: Conversation, member: Address) => {
    try {
      return chatClient.value.removeMemberFromGroupConversation(conversation.hash, member);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const canRemoveMember = (conversation: Conversation, member: string) => {
    const { isGroup, creator } = conversation;

    if (!isGroup) {
      return false;
    }

    // If member is removing themselves or the group creator is performing the action
    return member === address.value || creator === address.value;
  };

  return {
    removeMember,
    canRemoveMember,
  };
}
