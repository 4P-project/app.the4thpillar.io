<script setup lang="ts">
import { formatEther } from 'viem';
import type { BandwidthPackage, Nft, NftPackage, Package } from '~/types/pollination-x';

defineProps<{
  color?:
    | 'white'
    | 'white-contrast'
    | 'muted'
    | 'muted-contrast'
    | 'primary'
    | 'info'
    | 'success'
    | 'warning'
    | 'danger'
    | 'none';
}>();

const { pxNfts, primaryNft, isLoading, connectStorageNft, mintNft, setPrimaryNft, upgradeNft, upgradeBandwidth } =
  usePollinationX();

const nftPackagesModalOpen = ref(false);
const selectedNftForUpgrade = ref<Nft>();
const processingNftPackageIds = ref<Set<number>>(new Set());

const openNftPackagesModal = (nftForUpgrade?: Nft) => {
  selectedNftForUpgrade.value = nftForUpgrade;
  nftPackagesModalOpen.value = true;
};

const closeModal = () => {
  nftPackagesModalOpen.value = false;
};

const handleNftPackageClick = (nftPackage: NftPackage) => {
  if (isNftPackageDisabled.value(nftPackage)) {
    return;
  }

  processingNftPackageIds.value.add(nftPackage.id);

  const action = selectedNftForUpgrade.value
    ? upgradeNft(selectedNftForUpgrade.value, nftPackage)
    : mintNft(nftPackage);

  action.then(() => {
    processingNftPackageIds.value.delete(nftPackage.id);
    closeModal();
  });
};

const handleBandwidthPackageClick = (pkg: BandwidthPackage) => {
  if (!selectedNftForUpgrade.value) {
    throw new Error('No NFT selected');
  }

  processingNftPackageIds.value.add(pkg.id);

  upgradeBandwidth(selectedNftForUpgrade.value, pkg).then(() => {
    processingNftPackageIds.value.delete(pkg.id);
    closeModal();
  });
};

const isNftPackageDisabled = computed(() => (nftPackage: NftPackage) => {
  // Disable all packages if any package being processed
  if (processingNftPackageIds.value.size) {
    return true;
  }

  // We don't disable nft packages if we are buying a new nft
  if (!selectedNftForUpgrade.value) {
    return false;
  }

  // If we have a selected nft for upgrade, we can't downgrade it
  let selectedNftSize = selectedNftForUpgrade.value.metadata.attributes[1].value.replace(/\D/g, '');

  if (selectedNftForUpgrade.value.metadata.attributes[1].value.includes('MB')) {
    selectedNftSize = 0;
  }

  return nftPackage.size <= selectedNftSize;
});

const pollinationXWidget = computed(() => {
  if (!pxNfts.value?.success) {
    return {
      title: 'PollinationX Storage On-Demand',
      text: '',
      button: {
        text: 'Connect PX sNFTs',
        click: () => connectStorageNft(),
      },
    };
  }
  if (!pxNfts.value?.nfts?.length) {
    return {
      title: 'PollinationX Storage On-Demand',
      text: 'Connected',
      button: {
        text: 'Mint your FREE 100MB PX sNFT',
        click: () => mintNft(),
      },
    };
  }

  return {
    title: 'PollinationX Storage On-Demand',
    text: 'Connected',
    ...(pxNfts.value.packages.length && {
      button: {
        text: 'Buy new PX sNFT',
        click: () => openNftPackagesModal(),
      },
    }),
  };
});

const pollinationXModalInfo = computed(() => ({
  title: selectedNftForUpgrade.value ? 'Upgrade existing PX sNFT' : 'Mint new PX sNFT',
}));

const packagesList = computed(() => {
  if (!pxNfts.value) {
    return [];
  }

  return selectedNftForUpgrade.value
    ? [...pxNfts.value.bandwidthPackages, ...pxNfts.value.packages]
    : [...pxNfts.value.packages];
});

const isNftPackage = (pkg: Package): pkg is NftPackage => {
  return typeof pkg === 'object' && 'size' in pkg && 'bandwidthLimit' in pkg;
};
</script>

<template>
  <BaseCard class="p-6" :color="color">
    <div class="group relative">
      <div class="py-6">
        <div class="relative">
          <img
            class="relative z-10 mx-auto max-w-[100px]"
            src="/img/logos/pollination-x-icon.svg"
            :alt="pollinationXWidget.title"
          />
          <div
            class="absolute start-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 transition-transform duration-300 group-hover:scale-150"
          ></div>
        </div>
      </div>
      <div class="text-center">
        <BaseHeading as="h3" size="md" weight="normal" lead="tight" class="mb-1 text-muted-800 dark:text-white">
          <span>{{ pollinationXWidget.title }}</span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <span class="text-muted-400">{{ pollinationXWidget.text }}</span>
        </BaseParagraph>
      </div>
      <div v-if="pollinationXWidget.button" class="mt-4 text-center">
        <BaseButton
          target="_blank"
          class="w-full max-w-sm"
          color="primary"
          :loading="isLoading"
          @click.passive="pollinationXWidget.button.click"
        >
          <Icon name="ph:cursor-click" class="h-5 w-5" />
          <span>{{ pollinationXWidget.button.text }}</span>
        </BaseButton>
      </div>
      <div v-if="pxNfts?.nfts?.length" class="mt-4 text-center">
        <BaseParagraph v-if="!primaryNft || pxNfts.packages.length > 1" size="xs">
          <span class="text-muted-400">Click to select default PX sNFT ↓</span>
        </BaseParagraph>
        <ul class="mt-2">
          <li
            v-for="(nft, index) in pxNfts.nfts"
            :key="index"
            class="mb-1 rounded hover:bg-muted-100/80 dark:hover:bg-muted-700/60"
            :class="{ 'bg-muted-100/80 dark:bg-muted-700/60': nft === primaryNft }"
            @click="setPrimaryNft(nft)"
          >
            <div class="flex cursor-pointer p-2">
              <img src="/img/logos/pollination-x-icon.svg" :alt="pollinationXWidget.title" class="mr-2 h-5 w-5" />
              <Icon
                v-if="pxNfts.packages.length"
                name="ph:note-pencil"
                class="mr-2 h-5 w-5 text-muted-500 hover:text-muted-600 dark:text-muted-400/80 dark:hover:text-muted-200"
                @click="openNftPackagesModal(nft)"
              />
              <BaseParagraph size="xs">
                {{ nft.title }} (Size: {{ nft.metadata.attributes[1].value }}, Bandwidth:
                {{ nft.metadata.attributes[2].value }}, Usage {{ nft.metadata.attributes[0].value }}%)
              </BaseParagraph>
              <Icon
                v-if="nft === primaryNft"
                name="feather:check"
                class="ml-auto h-5 w-5 text-success-500 dark:text-success-400"
              />
            </div>
          </li>
        </ul>
      </div>
    </div>
  </BaseCard>
  <ModalDialog v-if="nftPackagesModalOpen" :open="nftPackagesModalOpen" size="sm" @close="closeModal">
    <div class="flex w-full items-center justify-between p-4 md:p-6">
      <h3 class="font-heading text-lg font-medium leading-6 text-muted-900 dark:text-white">
        {{ pollinationXModalInfo.title }}
      </h3>
      <BaseButtonClose @click="closeModal" />
    </div>
    <BaseParagraph v-if="selectedNftForUpgrade" size="xs" class="pb-4 text-center">
      <span class="text-muted-400">
        Upgrading:
        {{
          `${selectedNftForUpgrade.title}
          (Size: ${selectedNftForUpgrade.metadata.attributes[1].value},
          Bandwidth: ${selectedNftForUpgrade.metadata.attributes[2].value},
          Usage ${selectedNftForUpgrade.metadata.attributes[0].value}%)`
        }}
      </span>
    </BaseParagraph>
    <div v-if="pxNfts" class="grid grid-cols-2 gap-2 p-4 pt-0">
      <div
        v-for="pkg in packagesList"
        :key="pkg.id"
        class="cursor-pointer rounded-xl border border-muted-200 p-4 text-center hover:bg-muted-100 dark:border-muted-700 hover:dark:bg-muted-900"
      >
        <div
          :class="{
            'cursor-not-allowed opacity-30': isNftPackage(pkg) && isNftPackageDisabled(pkg),
          }"
          @click="isNftPackage(pkg) ? handleNftPackageClick(pkg) : handleBandwidthPackageClick(pkg)"
        >
          <img
            src="/img/logos/pollination-x-icon.svg"
            :class="{ 'animate-spin': processingNftPackageIds.has(pkg.id) }"
            class="mx-auto mb-2 h-8 w-8"
            alt="PollinationX icon"
          />
          <div>
            <span v-if="isNftPackage(pkg)" class="block text-sm">Size: {{ pkg.size }} {{ pkg.storageUnit }}</span>
            <span class="block text-sm">Price: {{ formatEther(pkg.price) }} {{ pxNfts?.symbol }}</span>
            <span class="block text-sm">Bandwidth: {{ isNftPackage(pkg) ? pkg.bandwidthLimit : pkg.bandwidth }}</span>
          </div>
        </div>
      </div>
    </div>
  </ModalDialog>
</template>
