import type { Address } from 'viem';
import { encodeFunctionData, toHex } from 'viem';
import { useStorage } from '@vueuse/core';
import { useToast } from 'vue-toastification';
import { PollinationX } from '@4thtech-sdk/storage';
import pollinationXAbi from '~/assets/abi/pollination-x.json';
import type { GetNft, Nft, NftPackage, PollinationXConfig } from '~/types/pollination-x';

export function usePollinationX() {
  const { address } = useAccount();
  const chainId = useChainId();
  const { walletClient } = useWallet();
  const runtimeConfig = useRuntimeConfig();
  const { signMessageAsync } = useSignMessage();
  const toast = useToast();

  const signature = useStorage(`pollination-x-${address.value}`, '');

  const pollinationXConfig: PollinationXConfig = {
    url: 'https://u4jc7p.pollinationx.io',
    authMessage:
      'This request will check your PollinationX storage NFT and it will not trigger a blockchain transaction or cost any gas fees.',
  };

  const pollinationXClient = useState<PollinationX | undefined>('pollination-x-client');
  const pxNfts = useState<GetNft | undefined>('px-nfts');
  const primaryNft = useState<Nft | undefined>('primary-nft');
  const isLoading = useState('is-loading-pollination-x', () => false);

  const isNftIntegrationEnabled = !(runtimeConfig.public.pollinationX.url && runtimeConfig.public.pollinationX.token);

  const initializePollinationXClient = () => {
    const endpoint = isNftIntegrationEnabled ? primaryNft.value?.endpoint : runtimeConfig.public.pollinationX.url;
    const token = isNftIntegrationEnabled ? primaryNft.value?.jwt : runtimeConfig.public.pollinationX.token;

    if (endpoint && token) {
      pollinationXClient.value = new PollinationX(endpoint, token);
    }
  };

  const disconnectPollinationX = () => {
    if (isNftIntegrationEnabled) {
      pollinationXClient.value = undefined;
      pxNfts.value = undefined;
      primaryNft.value = undefined;
    }
  };

  const setPrimaryNft = (nft: Nft) => {
    primaryNft.value = nft;
    initializePollinationXClient();
  };

  const fetchUserNfts = async () => {
    if (!address.value) {
      return;
    }

    if (!signature.value) {
      signature.value = await signMessageAsync({ message: pollinationXConfig.authMessage });
    }

    const queryParams = new URLSearchParams({
      wallet: address.value,
      chain: toHex(chainId.value),
      nonce: pollinationXConfig.authMessage,
      signature: signature.value,
    });

    const response = await fetch(`${pollinationXConfig.url}/auth/v2/login?${queryParams.toString()}`, {
      method: 'GET',
    });

    return response.json();
  };

  const connectStorageNft = async () => {
    isLoading.value = true;
    pxNfts.value = await fetchUserNfts()
      .catch((error) => toast.error(error.message))
      .finally(() => (isLoading.value = false));

    if (pxNfts.value?.error) {
      toast.error(pxNfts.value.error);
    } else if (pxNfts.value?.nfts?.length) {
      setPrimaryNft(pxNfts.value.nfts[0]);
    }
  };

  const mintNft = async (nftPackage?: NftPackage) => {
    isLoading.value = true;
    toast.info('Minting in progress');

    const isFreeMint = !nftPackage;
    const nftPackageId = isFreeMint ? 0 : nftPackage.id;
    const nftPackagePrice = isFreeMint ? 0n : BigInt(nftPackage.price);

    try {
      const txReceipt = await sendTransaction('mint', [nftPackageId], nftPackagePrice);

      if (txReceipt.status === 'success') {
        toast.success('Minted');
        await connectStorageNft();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      isLoading.value = false;
    }
  };

  const upgradeNft = async (selectedNftForUpgrade: Nft, nftPackage: NftPackage) => {
    isLoading.value = true;
    toast.info('Upgrading PX sNFT in progress');

    try {
      const txReceipt = await sendTransaction(
        'upgradeTokenPackage',
        [parseInt(selectedNftForUpgrade.id.tokenId), nftPackage.id],
        BigInt(nftPackage.price),
      );

      if (txReceipt.status === 'success') {
        toast.success('Minted');
        await connectStorageNft();
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      isLoading.value = false;
    }
  };

  const sendTransaction = async (functionName: string, args: any[], value: bigint = 0n) => {
    const encodedData = encodeFunctionData({
      abi: pollinationXAbi,
      functionName,
      args,
    });

    const hash = await walletClient.sendTransaction({
      data: encodedData,
      to: pxNfts.value?.contractAddress as Address,
      value,
    });

    return usePublicClient().value.waitForTransactionReceipt({ hash });
  };

  onMounted(() => {
    if (signature.value && !pxNfts.value) {
      connectStorageNft();
    }
  });

  return {
    pollinationXClient,
    isNftIntegrationEnabled,
    pxNfts,
    primaryNft,
    isLoading,
    connectStorageNft,
    mintNft,
    setPrimaryNft,
    upgradeNft,
    disconnectPollinationX,
    initializePollinationXClient,
  };
}
