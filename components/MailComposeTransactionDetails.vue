<script setup lang="ts">
import type { TransactionHash } from '@4thtech-sdk/types';
import { reactiveOmit } from '@vueuse/core';

const props = defineProps<{
  transactionHash: TransactionHash;
  composeNew: Function;
}>();

const { chain } = useWagmiNetwork();

const blockExplorer = computed(() => chain?.value?.blockExplorers?.default);

const { data: transactionReceipt, isSuccess } = useWaitForTransaction({
  hash: props.transactionHash,
});

const toSentence = (text: string) => {
  return (
    text
      // Insert a space before all caps
      .replace(/([A-Z])/g, ' $1')
      // Uppercase the first character
      .replace(/^./, (str) => str.toUpperCase())
      // Remove any leading space
      .trim()
  );
};
</script>

<template>
  <BaseCard>
    <div class="flex items-center justify-center pb-10 pt-5">
      <!-- Placeholder -->
      <BasePlaceholderPage
        title="Your mail is on its way"
        subtitle="Transaction is created and pushed to the network. Below you can see the transaction details."
      >
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-launch.svg"
            alt="placeholder-image"
          />
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-launch-dark.svg"
            alt="placeholder-image"
          />
        </template>

        <div class="mx-auto mt-4 flex w-full max-w-[360px] justify-between gap-2">
          <BaseButton
            v-if="blockExplorer"
            :href="`${blockExplorer.url}/tx/${transactionHash}`"
            target="_blank"
            class="h-11 w-full"
          >
            Open explorer
          </BaseButton>
          <BaseButton color="primary" class="h-12 w-full items-center gap-2" @click="composeNew()">
            <Icon name="lucide:plus" class="h-5 w-5" />
            Compose new
          </BaseButton>
        </div>
      </BasePlaceholderPage>
    </div>
    <!-- Transaction details -->
    <div class="px-10 py-10">
      <!-- Transaction header -->
      <div class="flex items-center gap-4">
        <div
          class="flex h-14 w-14 shrink-0 items-center justify-center rounded-full font-sans text-2xl"
          :class="
            isSuccess
              ? 'bg-success-100 text-success-500 dark:border-2 dark:border-success-500 dark:bg-success-500/20 dark:text-success-400'
              : 'bg-info-100 text-info-500 dark:border-2 dark:border-info-500 dark:bg-info-500/20 dark:text-info-400'
          "
        >
          <Icon :name="isSuccess ? 'ph:check-circle' : 'ph:clock-countdown'" class="h-5 w-5" />
        </div>
        <div class="block text-xl font-semibold text-gray-700">
          <BaseHeading as="h5" size="lg" weight="medium" class="text-muted-800 dark:text-muted-100">
            Transaction details
          </BaseHeading>
          <BaseText size="sm" class="text-muted-400">{{ isSuccess ? 'Successful' : 'Pending' }}</BaseText>
        </div>
      </div>
      <!-- Transaction content -->
      <div v-if="isSuccess" class="mt-10 space-y-5">
        <div
          v-for="(value, name, index) in reactiveOmit(transactionReceipt, [
            'logs',
            'logsBloom',
            'contractAddress',
            'status',
          ])"
          :key="index"
          class="flex items-center"
        >
          <div>
            <BaseHeading as="h6" size="sm" weight="medium" class="text-muted-800 dark:text-muted-100">
              <span>{{ toSentence(name) }}{{ name === 'to' ? ' (smart contract)' : '' }}</span>
            </BaseHeading>
            <BaseParagraph size="xs">
              <span class="text-muted-400">{{ value }}</span>
            </BaseParagraph>
          </div>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
