<script setup lang="ts">
const { isProEnabled, isPro, upgradeNowLink } = useProVersion();

const title = computed(() => (isPro.value ? 'Pro Membership Active' : 'Upgrade to Pro'));

const description = computed(() => {
  if (!isProEnabled.value) {
    return 'Pro version is not available on this network.';
  }

  return isPro.value
    ? 'You are enjoying the full benefits of our Pro membership! Thank you for your support. Explore all the advanced features and make the most out of your experience.'
    : 'Unlock advanced features and enhance your experience by upgrading to the Pro version. Fund your account with just FOUR tokens to enjoy all the benefits of a Pro membership.';
});

const hasSwapLink = computed(() => !!upgradeNowLink.value?.swapLink);
</script>

<template>
  <BaseCard class="p-6">
    <!-- Title -->
    <div class="mb-6">
      <BaseHeading
        as="h3"
        size="md"
        weight="normal"
        lead="tight"
        class="mb-2 flex justify-between text-muted-800 dark:text-white"
      >
        <span>{{ title }}</span>
        <Icon name="ph:crown" class="h-5 w-5 text-amber-500" />
      </BaseHeading>
      <BaseParagraph size="xs">
        <span class="text-muted-400">
          {{ description }}
        </span>
      </BaseParagraph>
    </div>
    <!-- Action -->
    <div v-if="!isPro && upgradeNowLink">
      <BaseButton :href="upgradeNowLink.buyLink" target="_blank" color="primary" class="w-full">
        {{ hasSwapLink ? 'Buy Tokens' : 'Upgrade Now' }}
      </BaseButton>
      <BaseButton
        v-if="hasSwapLink"
        :href="upgradeNowLink.swapLink"
        target="_blank"
        color="primary"
        flavor="pastel"
        class="mt-2 w-full"
      >
        Swap Tokens
      </BaseButton>
    </div>
  </BaseCard>
</template>
