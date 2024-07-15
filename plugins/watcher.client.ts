import { watchAccount } from 'use-wagmi/actions';

export default defineNuxtPlugin(() => {
  const { primaryNft, disconnectPollinationX, initializePollinationXClient } = usePollinationX();
  const { initializeEncryptor } = useEncryptor();
  const { initializeMailClient } = useMailClient();
  const { initializeChatClient } = useChatClient();
  const { address } = useAccount();
  const { chain } = useWagmiNetwork();
  const route = useRoute();

  initializePollinationXClient();

  watch(
    [() => chain?.value?.id, () => address?.value],
    () => {
      initializeEncryptor();
      initializeMailClient();
      initializeChatClient();
      disconnectPollinationX();
    },
    { immediate: true },
  );

  watch(
    () => primaryNft.value?.id.tokenId,
    () => {
      initializeMailClient();
    },
  );

  watchAccount((account) => {
    const isAtHomePage = route.name === 'index';
    const shouldRedirectToHome = !isAtHomePage && account.isDisconnected;
    const shouldRedirectToDashboard = isAtHomePage && account.isConnected;

    if (shouldRedirectToHome) {
      navigateTo('/');
    } else if (shouldRedirectToDashboard) {
      navigateTo('/dashboard');
    }
  });
});
