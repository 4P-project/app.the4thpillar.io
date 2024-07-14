<script setup lang="ts">
const { isPro, upgradeNowLink } = useProVersion();

const title = computed(() => (isPro.value ? 'Pro Membership Active' : 'Upgrade to Pro'));

const description = computed(() =>
  isPro.value
    ? 'You are enjoying the full benefits of our Pro membership! Thank you for your support. Explore all the advanced features and make the most out of your experience.'
    : 'Unlock advanced features and enhance your experience by upgrading to the Pro version. Fund your account with just FOUR tokens to enjoy all the benefits of a Pro membership.',
);
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
    <BaseButton v-if="!isPro && upgradeNowLink" :href="upgradeNowLink" target="_blank" color="primary" class="w-full">
      Upgrade Now
    </BaseButton>
  </BaseCard>
</template>
