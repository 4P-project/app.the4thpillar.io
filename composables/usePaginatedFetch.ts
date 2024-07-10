export function usePaginatedFetch<T>(
  fetchPaginated: (startIndex: bigint, howMany: bigint) => Promise<T[]>,
  fetchTotalCount: () => Promise<bigint>,
  pageSize = 10n,
  order: 'asc' | 'desc' = 'asc',
) {
  const isInitialized = ref(false);
  const items = ref<T[]>([]);
  const totalCount = ref(0n);
  const currentStartIndex = ref(0n);
  const isLoading = ref(false);

  const canLoadMore = computed(() => {
    if (!isInitialized.value) {
      return true;
    }
    return order === 'asc' ? currentStartIndex.value < totalCount.value : currentStartIndex.value > 0n;
  });

  const initialize = async () => {
    totalCount.value = await fetchTotalCount();
    currentStartIndex.value = order === 'asc' ? 0n : totalCount.value;
    isInitialized.value = true;
  };

  const fetchInitial = async () => {
    await initialize();

    // Fetch the initial page of data
    if (canLoadMore.value && items.value.length === 0) {
      await fetchMore();
    }
  };

  const fetchMore = async () => {
    if (!isInitialized.value) {
      await initialize();
    }

    if (isLoading.value || !canLoadMore.value) {
      return;
    }

    isLoading.value = true;

    try {
      let fetchCount = pageSize;
      let fetchIndex = currentStartIndex.value;

      if (order === 'desc') {
        fetchCount = currentStartIndex.value < pageSize ? currentStartIndex.value : pageSize;
        fetchIndex -= fetchCount;
        fetchIndex = fetchIndex < 0n ? 0n : fetchIndex;
      }

      const newItems = await fetchPaginated(fetchIndex, fetchCount);

      items.value = order === 'asc' ? [...items.value, ...newItems] : [...newItems, ...items.value];
      currentStartIndex.value = order === 'asc' ? currentStartIndex.value + fetchCount : fetchIndex;
    } catch (error) {
      console.error('Failed to fetch more items:', error);
    } finally {
      isLoading.value = false;
    }
  };

  const reset = async (fetchData = true) => {
    isInitialized.value = false;
    items.value = [];
    totalCount.value = 0n;
    currentStartIndex.value = 0n;

    if (fetchData) {
      await fetchInitial();
    }
  };

  return {
    items,
    isLoading,
    totalCount,
    canLoadMore: () => canLoadMore.value,
    fetchMore,
    reset,
  };
}
