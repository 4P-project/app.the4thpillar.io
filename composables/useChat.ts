import type { Address, Conversation, ConversationHash, Message, ReceivedMessage } from '@4thtech-sdk/types';
import { Chat } from '@4thtech-sdk/ethereum';
import { useToast } from 'vue-toastification';
import type { ConversationWithMessages, GroupConversationConfig, TmpSentMessage } from '~/types/chat';

export function useChat() {
  const { address } = useAccount();
  const toast = useToast();

  const chatClient = useState<Chat>('chat-client');
  const isConversationsLoading = useState<boolean>('conversations-loading', () => false);
  const isMessagesLoading = useState<boolean>('messages-loading', () => false);
  const conversations = useState<Map<ConversationHash, ConversationWithMessages>>('conversations', () => new Map());
  const selectedConversation = useState<ConversationWithMessages | undefined>('selected-conversation');
  const unwatchOnMemberAddedToConversation = useState<Function>('unwatch-on-member-added-to-conversation');
  const unwatchOnMemberRemovedFromConversation = useState<Function>('unwatch-on-member-removed-from-conversation');
  const unwatchOnMessageSent = useState<Map<ConversationHash, Function>>('unwatch-on-message-sent', () => new Map());

  const initializeChatClient = () => {
    cleanState();

    const { walletClient } = useWallet();
    const { encryptorClient } = useEncryptor();

    if (!walletClient.chain?.contracts?.chat) {
      return;
    }

    chatClient.value = new Chat({
      walletClient,
      encryptor: encryptorClient,
    });

    fetchConversations().then(() => {
      listenForEvents();
    });
  };

  const cleanState = () => {
    conversations.value = new Map();
    selectedConversation.value = undefined;
  };

  const getOneToOneConversationReceiver = (members: readonly Address[]) => {
    return members.find((member) => member !== address.value);
  };

  const addConversationWithMessages = (conversation: Conversation) => {
    const conversationWithMessages = {
      ...conversation,
      name: conversation.name || getOneToOneConversationReceiver(conversation.members) || '',
      messages: new Map(),
    };
    conversations.value.set(conversation.hash, conversationWithMessages);
  };

  const fetchConversation = (conversationHash: ConversationHash) => {
    chatClient.value.fetchConversation(conversationHash).then((conversation: Conversation) => {
      addConversationWithMessages(conversation);
    });
  };

  const fetchConversations = async () => {
    if (!address.value) {
      return;
    }

    isConversationsLoading.value = true;

    const fetchedConversations = await chatClient.value.fetchConversations(address.value);

    fetchedConversations.forEach((conversation) => {
      addConversationWithMessages(conversation);
    });

    isConversationsLoading.value = false;
  };

  const fetchMessages = async (conversationHash: ConversationHash) => {
    isMessagesLoading.value = true;
    const messagesCount = await chatClient.value.countMessages(conversationHash);
    const pageSize = 50n;
    const pageNumber = (messagesCount + pageSize - 1n) / pageSize;
    const fetchPromises = [];

    for (let currentPage = 1n; currentPage <= pageNumber; currentPage++) {
      fetchPromises.push(chatClient.value.fetchConversationMessagesPaginated(conversationHash, currentPage, pageSize));
    }

    const results = await Promise.allSettled(fetchPromises);
    const isFulfilled = (
      result: PromiseSettledResult<ReceivedMessage[]>,
    ): result is PromiseFulfilledResult<ReceivedMessage[]> => result.status === 'fulfilled';
    const receivedMessages = results.filter(isFulfilled).flatMap((result) => result.value);

    if (conversations.value.has(conversationHash)) {
      const conversation = conversations.value.get(conversationHash);
      if (conversation) {
        receivedMessages.forEach((message) => {
          conversation.messages.set(message.index, message);
        });
      }
    }
    isMessagesLoading.value = false;
  };

  const onConversationSelect = (conversationHash: ConversationHash) => {
    selectedConversation.value = conversations.value.get(conversationHash);
    fetchMessages(conversationHash);
  };

  const listenForNewMessages = () => {
    watchEffect((onInvalidate) => {
      // Iterate over all conversations and set up listeners
      conversations.value.forEach((conversation) => {
        if (unwatchOnMessageSent.value.has(conversation.hash)) {
          return;
        }

        const unwatch = chatClient.value.onMessageSent(
          null,
          conversation.hash,
          null,
          (conversationHash, receivedMessage) => {
            conversations.value.get(conversationHash)?.messages.set(receivedMessage.index, receivedMessage);

            // TODO: It's a workaround; When creating a new conversation, the reference it's not the same. Check why and fix it.
            // Re-set selectedConversation to ensure it points to the updated object
            if (selectedConversation.value?.hash === conversationHash) {
              selectedConversation.value = conversations.value.get(conversationHash);
            }
          },
        );

        // Store the unwatch function to allow cleanup later
        unwatchOnMessageSent.value.set(conversation.hash, unwatch);
      });

      // Cleanup: Remove listeners for conversations that no longer exist
      onInvalidate(() => {
        unwatchOnMessageSent.value.forEach((unwatch, conversationHash) => {
          if (!conversations.value.has(conversationHash)) {
            unwatch();
            unwatchOnMessageSent.value.delete(conversationHash);
          }
        });
      });
    });
  };

  const listenForMemberAddedToConversation = () => {
    if (!address.value) {
      return;
    }

    unwatchOnMemberAddedToConversation.value = chatClient.value.onMemberAddedToConversation(
      null,
      null,
      (conversationHash, _member) => {
        const conversation = conversations.value.get(conversationHash);

        if (conversation && !conversation.members.includes(_member)) {
          conversation.members.push(_member);
        } else if (address.value === _member) {
          fetchConversation(conversationHash);
        }
      },
    );
  };

  const listenForMemberRemovedFromConversation = () => {
    if (!address.value) {
      return;
    }

    unwatchOnMemberAddedToConversation.value = chatClient.value.onMemberRemovedFromConversation(
      null,
      null,
      (conversationHash, _member) => {
        const conversation = conversations.value.get(conversationHash);

        if (!conversation) {
          return;
        }

        if (address.value !== _member) {
          conversation.members = conversation.members.filter((member) => member !== _member);
          return;
        }

        conversations.value.delete(conversationHash);

        if (selectedConversation.value?.hash === conversationHash) {
          selectedConversation.value = undefined;
        }
      },
    );
  };

  const listenForEvents = () => {
    // First remove previous listeners
    stopListeningForEvents();

    // Then add new listeners
    listenForMemberAddedToConversation();
    listenForMemberRemovedFromConversation();
    listenForNewMessages();
  };

  const stopListeningForEvents = () => {
    unwatchOnMemberAddedToConversation.value?.();
    unwatchOnMemberRemovedFromConversation.value?.();
    unwatchOnMessageSent.value.forEach((unwatch) => {
      unwatch();
    });
    unwatchOnMessageSent.value = new Map();
  };

  const createOneToOneConversation = (receiver: Address) => {
    if (!address.value) {
      return;
    }

    // Calculate conversation hash
    const conversationHash = chatClient.value.calculateConversationHash(address.value, receiver);

    // Find conversation
    let conversation = conversations.value.get(conversationHash);

    // Create new conversation if not exists
    if (!conversation) {
      conversation = {
        hash: conversationHash,
        isGroup: false,
        name: receiver,
        creator: address.value,
        isOnlyCreatorAllowedToAddMembers: false,
        isEncrypted: true,
        members: [address.value, receiver],
        messages: new Map(),
      };
      conversations.value.set(conversation.hash, conversation);
    }

    // Select conversation
    onConversationSelect(conversationHash);
  };

  const createGroupConversation = (groupConversationConfig: GroupConversationConfig) => {
    const { name, isOnlyCreatorAllowedToAddMembers, isEncrypted, members } = groupConversationConfig;

    return chatClient.value.createGroupConversation(name, isOnlyCreatorAllowedToAddMembers, isEncrypted, members);
  };

  const sendMessage = async (content: string) => {
    if (!selectedConversation.value || !address.value) {
      return;
    }

    const { isGroup, isEncrypted, messages, hash, members } = selectedConversation.value;

    const message = {
      content,
    };

    const isConversationCreated = isGroup || messages.size;

    const transactionHash = isConversationCreated
      ? await chatClient.value.addMessageToConversation(hash, message, isEncrypted)
      : await sendDirectMessage(members, message, isEncrypted);

    const tmpSentMessage: TmpSentMessage = {
      sender: address.value,
      content,
      sentAt: new Date(),
      index: `tmp-${Date.now()}`,
      transactionHash,
    };
    selectedConversation.value.messages.set(tmpSentMessage.index, tmpSentMessage);

    usePublicClient()
      .value.waitForTransactionReceipt({ hash: transactionHash })
      .then((txReceipt) => {
        if (txReceipt.status === 'success') {
          selectedConversation.value?.messages.delete(tmpSentMessage.index);
        }
      });
  };

  const sendDirectMessage = (members: readonly Address[], message: Message, encryptMessage: boolean) => {
    const receiver = getOneToOneConversationReceiver(members);
    if (!receiver) {
      throw new Error('No receiver found');
    }

    return chatClient.value.sendMessage(receiver, message, encryptMessage);
  };

  const addMembers = (members: Address[]) => {
    if (!selectedConversation.value) {
      return;
    }

    return chatClient.value.addMembersToGroupConversation(selectedConversation.value.hash, members);
  };

  const removeMember = (member: Address) => {
    if (!selectedConversation.value) {
      return;
    }

    const { hash } = selectedConversation.value;

    try {
      return chatClient.value.removeMemberFromGroupConversation(hash, member);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return {
    chatClient,
    isConversationsLoading,
    isMessagesLoading,
    conversations,
    selectedConversation,
    initializeChatClient,
    onConversationSelect,
    createOneToOneConversation,
    createGroupConversation,
    sendMessage,
    addMembers,
    removeMember,
  };
}
