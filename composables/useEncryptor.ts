import { EncryptorState } from '@4thtech-sdk/types';
import { Encryptor, User } from '@4thtech-sdk/ethereum';
import { EncryptorExtensionConnector } from '@4thtech-sdk/encryptor';

type EncryptorInfo = {
  isInstalled?: boolean;
  isInitialized?: boolean;
  isLocked?: boolean;
  isUnlocked?: boolean;
  getState?: EncryptorState;
  publicKey?: string;
  publicKeyType?: string;
  isPublicKeyStored?: boolean;
};

const REFRESH_INTERVAL_MS = 3_000;

export function useEncryptor() {
  const { address } = useAccount();

  const encryptorClient = useState<Encryptor>('encryptor-client');
  const encryptorExtension = useState<EncryptorExtensionConnector>('encryptor-extension');
  const userClient = useState<User>('user-client');
  const encryptorInfo = useState<EncryptorInfo>('encryptor-info', () => ({}));
  const unwatchOnEncryptionPublicKeySet = useState<Function>('unwatch-on-encryption-public-key-set');

  const fetchTimeoutId = ref();
  const isFetching = ref(false);

  const initializeEncryptor = () => {
    const { walletClient } = useWallet();

    if (!walletClient.chain?.contracts?.user) {
      return;
    }

    encryptorExtension.value = new EncryptorExtensionConnector();
    encryptorClient.value = new Encryptor({ encryptorExtension: encryptorExtension.value, walletClient });
    userClient.value = new User({ walletClient });

    scheduleNextFetch(true);
    listenForEvents();
  };

  const scheduleNextFetch = (immediate = false) => {
    clearTimeout(fetchTimeoutId.value);

    const delay = immediate ? 0 : REFRESH_INTERVAL_MS;

    fetchTimeoutId.value = setTimeout(async () => {
      await fetchAndUpdateEncryptorInfo();
    }, delay);
  };

  const fetchAndUpdateEncryptorInfo = async () => {
    if (isFetching.value) {
      return;
    }

    isFetching.value = true;

    try {
      const isInstalled = await encryptorExtension.value.isInstalled();
      if (!isInstalled) {
        encryptorInfo.value = { isInstalled };
        return;
      }

      const [getState, publicKey, publicKeyType] = await Promise.all([
        encryptorClient.value.getState(),
        encryptorClient.value.getPublicKey(),
        encryptorClient.value.getPublicKeyType(),
      ]);

      Object.assign(encryptorInfo.value, {
        isInstalled,
        isInitialized: getState !== EncryptorState.NOT_GENERATED,
        isLocked: getState === EncryptorState.LOCKED,
        isUnlocked: getState === EncryptorState.UNLOCKED,
        getState,
        publicKey,
        publicKeyType,
        isPublicKeyStored: encryptorInfo.value.isPublicKeyStored,
      });

      if (address.value && !encryptorInfo.value.isPublicKeyStored) {
        encryptorInfo.value.isPublicKeyStored = await encryptorClient.value.isUserAddressInitialized(address.value);
      }
    } catch (e) {
      // console.error('Error fetching encryptor info:', e);
    } finally {
      isFetching.value = false;
      scheduleNextFetch();
    }
  };

  const listenForEncryptionPublicKeySet = () => {
    if (address.value) {
      unwatchOnEncryptionPublicKeySet.value = userClient.value?.onEncryptionPublicKeySet(
        address.value,
        (user, publicKey, publicKeyType) => {
          if (
            user === address.value &&
            publicKey === encryptorInfo.value.publicKey &&
            publicKeyType === encryptorInfo.value.publicKeyType
          ) {
            encryptorInfo.value.isPublicKeyStored = true;
          }
        },
      );
    }
  };

  const listenForEvents = () => {
    // First remove previous listeners
    stopListeningForEvents();

    // Then add new listeners
    listenForEncryptionPublicKeySet();
  };

  const stopListeningForEvents = () => {
    unwatchOnEncryptionPublicKeySet.value?.();
  };

  const isReadyToUse = computed(
    () =>
      encryptorInfo.value.isInstalled &&
      encryptorInfo.value.isInitialized &&
      encryptorInfo.value.isUnlocked &&
      encryptorInfo.value.isPublicKeyStored,
  );

  onUnmounted(() => {
    clearTimeout(fetchTimeoutId.value);
    stopListeningForEvents();
  });

  return {
    encryptorClient: encryptorClient.value,
    userClient: userClient.value,
    encryptorInfo,
    initializeEncryptor,
    isReadyToUse,
  };
}
