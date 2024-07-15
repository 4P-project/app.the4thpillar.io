import type { Address } from '@4thtech-sdk/types';

export function useAddMailWhitelistAccounts() {
  const { mailClient } = useMailClient();

  const addAccounts = (accounts: Address[]) => {
    return mailClient.value.addToWhitelist(accounts);
  };

  return {
    addAccounts,
  };
}
