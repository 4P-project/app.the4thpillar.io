import type { Address } from '@4thtech-sdk/types';
import { parseEther } from 'viem';

// Define token addresses for specific chain IDs
const tokenAddresses: { [chainId: number]: Address } = {
  4_002: '0x901764bae9D1552d1794529Dce1CFaBC86FA7268', // Fantom Testnet
};

export function useProVersion() {
  const { address } = useAccount();
  const chainId = useChainId();

  const tokenAddress = tokenAddresses[chainId.value];
  const minRequiredTokenBalance = 10_000;

  if (!tokenAddress) {
    return {
      isPro: computed(() => false),
      token: null,
      minRequiredTokenBalance,
    };
  }

  const { data: token } = useBalance({
    address,
    watch: true,
    token: tokenAddress,
  });

  const isPro = computed(() => token.value && token.value.value >= parseEther(minRequiredTokenBalance.toString()));

  return {
    isPro,
    token,
    minRequiredTokenBalance,
  };
}
