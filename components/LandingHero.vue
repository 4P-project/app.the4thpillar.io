<script setup lang="ts">
const walletSelectModalOpen = ref(false);
</script>

<template>
  <div class="relative min-h-screen overflow-hidden bg-gradient-to-b from-transparent to-white dark:to-muted-900">
    <div class="gridlines absolute inset-x-0 -mt-8 py-20"></div>
    <div class="absolute inset-x-0 -mt-24 py-20">
      <div class="mt-12 grid grid-cols-2 -space-x-52 opacity-60 dark:opacity-50 2xl:mx-auto 2xl:max-w-6xl">
        <div class="h-40 bg-gradient-to-br from-primary-200 to-primary-400 blur-3xl dark:from-blue-700"></div>
        <div class="h-24 bg-gradient-to-r from-indigo-400 to-indigo-700 blur-3xl dark:to-primary-600"></div>
      </div>
    </div>
    <div class="mx-auto w-full max-w-7xl px-4">
      <div class="relative pt-32 text-center">
        <BaseHeading
          as="h1"
          size="5xl"
          weight="light"
          lead="tight"
          class="mx-auto mb-4 max-w-2xl text-muted-800 dark:text-white xs:!text-4xl"
        >
          On-chain
          <span class="font-hairline text-primary-500 underline decoration-dotted underline-offset-4">dMail</span> &
          <span class="font-hairline text-primary-500 underline decoration-dotted underline-offset-4">dChat</span>
        </BaseHeading>
        <BaseParagraph size="lg" class="mx-auto mb-4 max-w-2xl text-muted-500 dark:text-muted-100">
          Experience Web3-based communication that is non-custodial, censorship-resistant, de-platforming-resistant,
          data mining-resistant, and immutable with permanent permissionless access.
        </BaseParagraph>
        <div class="flex items-center justify-center">
          <BaseButton color="primary" shadow="hover" class="h-12 w-44 gap-2" @click="walletSelectModalOpen = true">
            <Icon name="ph:plugs" class="h-5 w-5" />
            Connect Wallet
          </BaseButton>
        </div>
      </div>
    </div>

    <WalletSelect :open="walletSelectModalOpen" @close="walletSelectModalOpen = false" />
  </div>
</template>

<style scoped>
.gridlines {
  background-image: url(/img/illustrations/gridlines.svg);
}

.dark .gridlines {
  background-image: url(/img/illustrations/gridlines-dark.svg);
}
</style>
