import type { ReceivedEnvelope } from '@4thtech-sdk/types';
import { Mail } from '@4thtech-sdk/ethereum';
import { EncryptionHandler } from '@4thtech-sdk/encryption';
import { useToast } from 'vue-toastification';

export function useMail() {
  const { address } = useAccount();
  const { pollinationXClient } = usePollinationX();
  const toast = useToast();

  const mailClient = useState<Mail>('mail-client');
  const isLoading = useState<boolean>('fetch-all-loading', () => false);
  const receivedEnvelopes = useState<ReceivedEnvelope[]>('received-envelopes', () => []);
  const selectedEnvelope = useState<ReceivedEnvelope | undefined>('selected-envelope');
  const unwatchOnNew = useState<Function>('unwatch-on-new');

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
    cleanState();

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
      encryptionHandler,
    });

    fetchAll();
    listenForMailEvents();
  };

  const cleanState = () => {
    receivedEnvelopes.value = [];
    selectedEnvelope.value = undefined;
  };

  const fetchAll = async () => {
    if (!address.value) {
      return;
    }

    isLoading.value = true;

    const mailsCount = await mailClient.value.count(address.value);
    const pageSize = 50n;
    const pageNumber = (mailsCount + pageSize - 1n) / pageSize;
    const fetchPromises = [];

    for (let currentPage = 1n; currentPage <= pageNumber; currentPage++) {
      fetchPromises.push(mailClient.value.fetchPaginated(address.value, currentPage, pageSize));
    }

    const results = await Promise.allSettled(fetchPromises);
    const isFulfilled = (
      result: PromiseSettledResult<ReceivedEnvelope[]>,
    ): result is PromiseFulfilledResult<ReceivedEnvelope[]> => result.status === 'fulfilled';
    const envelopes = results.filter(isFulfilled).flatMap((result) => result.value);

    receivedEnvelopes.value = envelopes.reverse();
    isLoading.value = false;
  };

  const listenForNewEnvelopes = () => {
    if (address.value) {
      unwatchOnNew.value = mailClient.value?.onNew(null, address.value, (envelope) => {
        receivedEnvelopes.value.unshift(envelope);
        toast.info('New mail in inbox.', { timeout: 15000 });
      });
    }
  };

  const listenForMailEvents = () => {
    // First remove previous listeners
    stopListeningForMailEvents();

    // Then add new listeners
    listenForNewEnvelopes();
  };

  const stopListeningForMailEvents = () => {
    unwatchOnNew.value?.();
  };

  return {
    mailClient,
    isLoading,
    receivedEnvelopes,
    selectedEnvelope,
    initializeMailClient,
  };
}
