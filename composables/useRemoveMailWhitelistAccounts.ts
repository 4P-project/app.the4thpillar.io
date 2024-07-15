import type { Address } from '@4thtech-sdk/types';
import { useToast } from 'vue-toastification';

export function useRemoveMailWhitelistAccounts() {
  const { mailClient } = useMailClient();
  const toast = useToast();

  const removeAccounts = (accounts: Address[]) => {
    try {
      return mailClient.value.removeFromWhitelist(accounts);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  return {
    removeAccounts,
  };
}
