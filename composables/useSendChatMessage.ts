import type { Address, Message } from '@4thtech-sdk/types';
import type { Conversation, TmpSentMessage } from '~/types/chat';

export function useSendChatMessage() {
  const { address } = useAccount();
  const { chatClient } = useChatClient();

  const sendMessage = async (conversation: Conversation, content: string) => {
    if (!address.value) {
      return;
    }

    const { isGroup, isEncrypted, messages, hash, members } = conversation;

    const message = {
      content,
    };

    const isConversationCreated = isGroup || messages.items.length;

    const transactionHash = isConversationCreated
      ? await chatClient.value.addMessageToConversation(hash, message, isEncrypted)
      : await sendDirectMessage(members.items, message, isEncrypted);

    const tmpSentMessage: TmpSentMessage = {
      sender: address.value,
      content,
      sentAt: new Date(),
      index: `tmp-${Date.now()}`,
      transactionHash,
    };
    conversation.messages.items.push(tmpSentMessage);
  };

  const sendDirectMessage = (members: readonly Address[], message: Message, encryptMessage: boolean) => {
    const receiver = members.find((member) => member !== address.value);
    if (!receiver) {
      throw new Error('No receiver found');
    }

    return chatClient.value.sendMessage(receiver, message, encryptMessage);
  };

  return {
    sendMessage,
  };
}
