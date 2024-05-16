<script setup lang="ts">
definePageMeta({
  layout: 'empty',
});

const app = useAppConfig();
const { connect, connectors } = useConnect();

const termsAccepted = ref<boolean>(false);

const getConnectorIcon = (connectorId: string) => {
  const connectorIcons: Record<string, string> = {
    coinbaseWallet: '/img/icons/connectors/coinbase.svg',
    metaMask: '/img/icons/connectors/metamask.svg',
    walletConnect: '/img/icons/connectors/wallet-connect.svg',
  };

  return connectorIcons[connectorId] || '';
};

const facts = [
  {
    icon: 'ph:messenger-logo',
    title: 'On-Chain communication',
    description: 'Experience self-custodial messaging; every email/message is a secure blockchain transaction.',
  },
  {
    icon: 'ph:lock-key-duotone',
    title: 'Encrypted communication',
    description: 'Secure wallet-to-wallet encryption powered by Encryptor Extension.',
  },
  {
    icon: 'ph:database-duotone',
    title: 'Decentralized Storage',
    description: 'Self-custodial data storage powered by PollinationX NFTs.',
  },
  {
    icon: 'ph:lightbulb-filament-duotone',
    title: 'Censorship Resistance',
    description: 'Protect against data mining and de-platforming.',
  },
  {
    icon: 'ph:crown-duotone',
    title: 'Pro Membership',
    description: 'Advanced features unlocked with Four Tokens (coming).',
  },
];
</script>

<template>
  <div class="flex min-h-screen bg-white dark:bg-muted-800">
    <div class="relative flex flex-1 flex-col justify-center px-6 py-12 lg:w-2/5 lg:flex-none">
      <div class="relative mx-auto w-full max-w-sm bg-white dark:bg-muted-800">
        <!--Nav-->
        <div class="flex w-full items-center justify-between">
          <!-- Logo -->
          <NuxtLink to="/" class="ms-2 inline-flex" aria-label="Go to homepage">
            <LogoIcon
              class="h-9 text-primary-500 group-[&.scrolled]/landing:h-6 group-[&:not(.scrolled)]/landing:h-7 motion-safe:transition-all motion-safe:duration-200"
            />
          </NuxtLink>
          <!--Theme button-->
          <BaseThemeToggle aria-label="Toggle dark mode" />
        </div>
        <div>
          <BaseHeading as="h2" size="2xl" lead="relaxed" weight="medium" class="mt-6">
            Welcome to 4P Email & Chat Super App.
          </BaseHeading>
          <BaseParagraph size="sm" class="mb-6 text-muted-400"> Connect your wallet to access the app </BaseParagraph>
          <!-- Terms -->
          <p class="text-sm leading-5 text-muted-500 dark:text-muted-400">
            Please accept
            <a
              :href="app.links.privacyPolicy"
              class="font-sans text-sm text-primary-500 underline-offset-4 hover:underline"
              target="_blank"
            >
              Privacy Policy
            </a>
            and
            <a
              :href="app.links.termsOfUse"
              target="_blank"
              class="font-sans text-sm text-primary-500 underline-offset-4 hover:underline"
            >
              User Agreement
            </a>
          </p>

          <div class="mt-5 flex items-center">
            <BaseCheckbox v-model="termsAccepted" label="I read and accepted" shape="rounded" color="primary" />
          </div>
          <!-- 	Connectors list	 -->
          <div class="mt-4 flex flex-col justify-center space-y-2">
            <BaseButton
              v-for="connector in connectors"
              :key="connector.id"
              :disabled="!termsAccepted || !connector.ready"
              class="tet-center flex w-full justify-center sm:mx-auto sm:w-full"
              @click="connect({ connector })"
            >
              <span class="flex">
                <span class="flex items-center">
                  <img class="mr-2 h-5 w-5" :src="getConnectorIcon(connector.id)" :alt="`${connector.name}`" />
                </span>
              </span>
              {{ connector.name }}
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <div class="relative hidden w-0 flex-1 items-center justify-center bg-muted-100 dark:bg-muted-900 lg:flex lg:w-3/5">
      <div class="mx-auto w-full max-w-4xl">
        <!--Illustration-->
        <div class="mx-auto max-w-md">
          <img class="block dark:hidden" src="/img/illustrations/connected-world.svg" alt="" />
          <img class="hidden dark:block" src="/img/illustrations/connected-world-dark.svg" alt="" />
        </div>
        <!-- Facts -->
        <div class="flex flex-col p-8">
          <div class="mt-6">
            <ul class="grid gap-x-4 gap-y-8 space-y-6 sm:grid-cols-2">
              <li v-for="(fact, index) in facts" :key="index" class="flex w-full items-center gap-2">
                <div
                  class="flex h-9 w-9 items-center justify-center rounded-full border border-muted-200 bg-white shadow-xl shadow-muted-300/30 dark:border-muted-600 dark:bg-muted-700 dark:shadow-muted-800/20"
                >
                  <Icon :name="fact.icon" class="h-4 w-4 text-success-500" />
                </div>
                <div>
                  <BaseHeading as="h3" size="sm" weight="medium">
                    {{ fact.title }}
                  </BaseHeading>
                  <BaseText size="xs" class="max-w-[210px] text-muted-500 dark:text-muted-400">
                    {{ fact.description }}
                  </BaseText>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
