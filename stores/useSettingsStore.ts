export const useSettingsStore = defineStore('settings', () => {
  const whitelistedAccounts = ref(useWhitelistedAccounts());

  return {
    whitelistedAccounts,
  };
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useMailStore, import.meta.hot));
}
