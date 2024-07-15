import { Mail } from '@4thtech-sdk/ethereum';
import { EncryptionHandler } from '@4thtech-sdk/encryption';

export function useMailClient() {
  const runtimeConfig = useRuntimeConfig();
  const { pollinationXClient } = usePollinationX();

  const mailClient = useState<Mail>('mail-client');

  const initializeRemoteStorageProvider = () => {
    return pollinationXClient.value;
  };

  const initializeEncryptionHandler = () => {
    const { encryptorAesEncryption } = useEncryption();

    return new EncryptionHandler({
      encryptionImplementations: [encryptorAesEncryption],
    });
  };

  const initializeMailClient = () => {
    const { walletClient } = useWallet();

    if (!walletClient.chain?.contracts?.mail) {
      return;
    }

    const remoteStorageProvider = initializeRemoteStorageProvider();

    if (!remoteStorageProvider) {
      return;
    }

    const encryptionHandler = initializeEncryptionHandler();

    mailClient.value = new Mail({
      walletClient,
      remoteStorageProvider,
      appId: runtimeConfig.public.mailAppId || undefined,
      encryptionHandler,
    });
  };

  return {
    mailClient,
    initializeMailClient,
  };
}
