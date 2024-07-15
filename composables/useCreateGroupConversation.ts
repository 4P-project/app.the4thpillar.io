import { useToast } from 'vue-toastification';
import type { GroupConversationConfig } from '~/types/chat';

export function useCreateGroupConversation() {
  const { chatClient } = useChatClient();
  const toast = useToast();

  const createGroupConversation = async (groupConversationConfig: GroupConversationConfig) => {
    const { name, isOnlyCreatorAllowedToAddMembers, isEncrypted, members } = groupConversationConfig;

    try {
      return await chatClient.value.createGroupConversation(
        name,
        isOnlyCreatorAllowedToAddMembers,
        isEncrypted,
        members,
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return {
    createGroupConversation,
  };
}
