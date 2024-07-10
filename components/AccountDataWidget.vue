<script setup lang="ts">
const { address } = useAccount();
const { chain } = useWagmiNetwork();

const { data: balance } = useBalance({
  address,
  watch: true,
});

const accountData = computed(() => {
  const data = [];

  if (address.value) {
    data.push({
      title: 'Address',
      icon: 'ph:key-duotone',
      color: 'bg-pink-500/20 text-pink-500',
      content: address.value,
    });
  }

  if (chain?.value) {
    data.push({
      title: 'Network',
      icon: 'ph:cube-focus-duotone',
      color: 'bg-success-500/20 text-success-500',
      content: chain.value.name,
    });
  }

  if (balance.value) {
    data.push({
      title: 'Balance',
      icon: 'ph:coins-duotone',
      color: 'bg-indigo-500/20 text-indigo-500',
      content: `${balance.value.formatted} ${balance.value.symbol}`,
    });
  }

  return data;
});
</script>

<template>
  <BaseCard class="p-6">
    <!-- Title -->
    <div class="mb-8 flex items-center justify-between">
      <BaseHeading as="h3" size="md" weight="normal" lead="tight" class="text-muted-800 dark:text-white">
        <span>Account</span>
      </BaseHeading>
    </div>
    <!-- List -->
    <div class="mb-2 space-y-5">
      <div v-for="(data, index) in accountData" :key="index" class="flex gap-3">
        <BaseIconBox shape="full" size="sm" :class="data.color">
          <Icon :name="data.icon" class="h-5 w-5" />
        </BaseIconBox>
        <div>
          <BaseHeading as="h4" size="sm" weight="light" lead="tight" class="text-muted-800 dark:text-white">
            <span>{{ data.title }}</span>
          </BaseHeading>
          <BaseParagraph size="xs">
            <p class="text-muted-400">{{ data.content }}</p>
          </BaseParagraph>
        </div>
      </div>
    </div>
  </BaseCard>
</template>
