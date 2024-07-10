<script setup lang="ts">
import { useToast } from 'vue-toastification';

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

const { encryptorClient, encryptorInfo } = useEncryptor();
const toast = useToast();

const encryptorWidget = computed(() => {
  if (!encryptorInfo.value.isInstalled) {
    return {
      title: 'Get Encryptor Now',
      text: 'Secure your communication effortlessly with the Encryptor browser extension.',
      button: {
        text: 'Install Encryptor',
        link: 'https://chrome.google.com/webstore/detail/encryptor/feolajpinjjfikmmeknkdjbllbppojij',
      },
    };
  }
  if (!encryptorInfo.value.isInitialized) {
    return {
      title: 'Ready to Set Up Encryptor',
      text: 'Open and configure your Encryptor extension to begin enjoying secure, encrypted communication. Set up now to ensure your messages are protected.',
    };
  }
  if (encryptorInfo.value.isLocked) {
    return {
      title: 'Unlock Your Encryptor',
      text: 'Your Encryptor extension is currently locked. Please unlock it to resume secure communication.',
    };
  }
  if (!encryptorInfo.value.isPublicKeyStored) {
    return {
      title: 'Register Your Encryptor',
      text: 'Please complete your registration with the Encryptor extension by creating a transaction on the smart contract. This step is essential to activate the extension’s full capabilities.',
      button: {
        text: 'Register Encryptor',
        click: () => registerExtension(),
      },
    };
  }

  return {
    title: 'Encryptor is Ready',
    text: 'Your Encryptor extension is now fully configured and ready to secure your communications.',
  };
});

const registerExtension = () => {
  encryptorClient.storePublicKey().catch((error) => toast.error(error.message));
};
</script>

<template>
  <BaseCard class="p-6" :color="color">
    <div class="group relative">
      <div class="py-6">
        <div class="relative">
          <img
            class="relative z-10 mx-auto max-w-[100px]"
            src="/img/logos/encryptor.svg"
            :alt="encryptorWidget.title"
          />
          <div
            class="absolute start-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary-500/10 transition-transform duration-300 group-hover:scale-150"
          ></div>
        </div>
      </div>
      <div class="text-center">
        <BaseHeading as="h3" size="md" weight="normal" lead="tight" class="mb-1 text-muted-800 dark:text-white">
          <span>{{ encryptorWidget.title }}</span>
        </BaseHeading>
        <BaseParagraph size="xs">
          <span class="text-muted-400">{{ encryptorWidget.text }}</span>
        </BaseParagraph>
      </div>
      <div v-if="encryptorWidget.button" class="mt-4 text-center">
        <BaseButton
          :to="encryptorWidget.button.link"
          target="_blank"
          class="w-full max-w-sm"
          color="primary"
          @click.passive="encryptorWidget.button.click"
        >
          <Icon name="ph:cursor-click" class="h-5 w-5" />
          <span>{{ encryptorWidget.button.text }}</span>
        </BaseButton>
      </div>
    </div>
  </BaseCard>
</template>
