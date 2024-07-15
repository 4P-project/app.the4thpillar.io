import type { Address } from '@4thtech-sdk/types';
import { parseEther } from 'viem';

// Define token addresses for specific chain IDs
const tokenAddresses: { [chainId: number]: Address } = {
  250: '0x9688d9e0041cc825c2f353deee6a7e20ebb80f74', // Fantom
  4_002: '0x901764bae9D1552d1794529Dce1CFaBC86FA7268', // Fantom Testnet
};

const upgradeNowLinks: { [chainId: number]: string } = {
  250: 'https://spooky.fi/#/best-swap?inputCurrency=ETH&outputCurrency=0x9688d9e0041cc825c2f353deee6a7e20ebb80f74&exactField=output&exactAmount=10000+&chain=fantom',
  4_002:
    'https://spooky.fi/#/best-swap?inputCurrency=ETH&outputCurrency=0x9688d9e0041cc825c2f353deee6a7e20ebb80f74&exactField=output&exactAmount=10000+&chain=fantom',
};

export function useProVersion() {
  const { address } = useAccount();
  const chainId = useChainId();

  const minRequiredTokenBalance = 10_000;

  const tokenAddress = computed(() => tokenAddresses[chainId.value]);
  const isProEnabled = computed(() => !!tokenAddress.value);
  const upgradeNowLink = computed(() => upgradeNowLinks[chainId.value]);

  if (!tokenAddress) {
    return {
      isProEnabled,
      isPro: computed(() => false),
      token: null,
      upgradeNowLink: null,
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
    isProEnabled,
    isPro,
    token,
    upgradeNowLink,
    minRequiredTokenBalance,
  };
}
