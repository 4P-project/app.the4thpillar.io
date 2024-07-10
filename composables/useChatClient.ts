import { Chat } from '@4thtech-sdk/ethereum';

export function useChatClient() {
  const runtimeConfig = useRuntimeConfig();

  const chatClient = useState<Chat>('chat-client');

  const initializeChatClient = () => {
    const { walletClient } = useWallet();
    const { encryptorClient } = useEncryptor();

    if (!walletClient.chain?.contracts?.chat) {
      return;
    }

    chatClient.value = new Chat({
      walletClient,
      appId: runtimeConfig.public.chatAppId || undefined,
      encryptor: encryptorClient,
    });
  };

  return {
    chatClient,
    initializeChatClient,
  };
}
