export interface Pagination<T> {
  items: T[];
  isLoading: boolean;
  totalCount: bigint;
  canLoadMore: () => boolean;
  fetchMore: () => Promise<void>;
  reset: () => Promise<void>;
}
