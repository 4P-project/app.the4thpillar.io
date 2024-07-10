import type { Address } from '@4thtech-sdk/types';

export function useWhitelistedAccounts() {
  const { mailClient } = useMailClient();
  const { address } = useAccount();

  const PAGE_SIZE = 50n;
  const ORDER = 'asc';

  // State for managing the listener
  const unwatchOnNew = useState<Function | null>('watch-on-account-added-to-whitelist', () => null);
  const unwatchOnRemoved = useState<Function | null>('watch-on-account-removed-from-whitelist', () => null);

  const fetchPaginated = async (startIndex: bigint, howMany: bigint): Promise<Address[]> => {
    return [...(await mailClient.value.fetchWhitelistedUsersPaginated(address.value, startIndex, howMany))];
  };

  const fetchTotalCount = (): Promise<bigint> => {
    return mailClient.value.getWhitelistedUsersCount(address.value);
  };

  const pagination = usePaginatedFetch<Address>(fetchPaginated, fetchTotalCount, PAGE_SIZE, ORDER);

  const subscribeToEvents = () => {
    unsubscribeFromEvents();

    unwatchOnNew.value = mailClient.value.onUserAddedToWhitelist(address.value, null, (_user, whitelistedAccount) => {
      if (!pagination.items.value.includes(whitelistedAccount)) {
        pagination.items.value.push(whitelistedAccount);
        pagination.totalCount.value += 1n;
      }
    });

    unwatchOnRemoved.value = mailClient.value.onUserRemovedFromWhitelist(
      address.value,
      null,
      (_user, whitelistedAccount) => {
        if (pagination.items.value.includes(whitelistedAccount)) {
          pagination.items.value = pagination.items.value.filter((item) => item !== whitelistedAccount);
          pagination.totalCount.value -= 1n;
        }
      },
    );
  };

  const unsubscribeFromEvents = () => {
    unwatchOnNew.value?.();
    unwatchOnNew.value = null;

    unwatchOnRemoved.value?.();
    unwatchOnRemoved.value = null;
  };

  // Watch for chatClient changes and reset state if it changes
  watch(
    mailClient,
    async (newClient, oldClient) => {
      if (newClient !== oldClient) {
        await pagination.reset();
        subscribeToEvents();
      }
    },
    { immediate: true },
  );

  return pagination;
}
