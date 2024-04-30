<script setup lang="ts">
import type { ReceivedMessage } from '@4thtech-sdk/types';
import { useToast } from 'vue-toastification';
import { type TmpSentMessage, type TmpMessageIndex, isTmpMessageIndex } from '~/types/chat';

definePageMeta({
  title: 'Chat',
  layout: 'empty',
});

const { address } = useAccount();
const { selectedConversation, isMessagesLoading, sendMessage } = useChat();
const { isReadyToUse: isEncryptorReadyToUse } = useEncryptor();
const toast = useToast();

const chatEl = ref<HTMLElement>();
const conversationDetailsOpen = ref(false);
// const search = ref('');
const messageInput = ref('');
const isMessageSending = ref(false);

watchEffect(() => {
  const messageCount = selectedConversation.value?.messages.size;

  // Wait for the DOM to update
  nextTick(() => {
    if (chatEl.value && messageCount) {
      chatEl.value.scrollTo({
        top: chatEl.value.scrollHeight,
        behavior: 'smooth',
      });
    }
  });
});

const isReceivedMessage = (message: ReceivedMessage | TmpSentMessage) => message.sender !== address.value;

const canShowDateSeparator = (message: ReceivedMessage | TmpSentMessage, index: bigint | TmpMessageIndex) => {
  if (typeof index !== 'bigint') {
    return false;
  }

  const messages = selectedConversation.value?.messages;

  // Check for existence and non-emptiness of messages
  if (!messages || messages.size === 0) {
    return false;
  }

  // Always show separator for the first message in a conversation
  if (index === 0n) {
    return true;
  }

  const previousMessage = messages.get(index - 1n);
  if (!previousMessage) {
    return false;
  }

  // Compare dates of the current message and the previous one
  const currentMessageDate = message.sentAt.toDateString();
  const previousMessageDate = previousMessage.sentAt.toDateString();

  return currentMessageDate !== previousMessageDate;
};

const submitMessage = async () => {
  if (!messageInput.value) return;
  if (!selectedConversation.value) return;
  if (isMessagesLoading.value) return;

  isMessageSending.value = true;

  try {
    await sendMessage(messageInput.value);
    messageInput.value = '';
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
  } finally {
    isMessageSending.value = false;
  }
};

const isEncryptorWidgetVisible = computed(
  () => !isEncryptorReadyToUse.value && selectedConversation.value?.isEncrypted,
);
</script>

<template>
  <div class="relative">
    <div class="flex min-h-screen bg-muted-100 dark:bg-muted-900">
      <!-- Sidebar -->
      <div
        class="relative z-10 hidden h-screen w-20 border-r border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 sm:block"
      >
        <div class="flex h-full flex-col justify-between">
          <div class="flex flex-col">
            <div class="flex h-16 w-16 shrink-0 items-center justify-center lg:w-full ltablet:w-full">
              <NuxtLink to="/" class="flex items-center justify-center">
                <LogoIcon class="h-10 text-primary-600" />
              </NuxtLink>
            </div>
            <div class="flex h-16 w-16 shrink-0 items-center justify-center lg:w-full ltablet:w-full">
              <a
                href="#"
                class="flex h-12 w-12 items-center justify-center rounded-2xl text-muted-400 transition-colors duration-300 hover:bg-primary-500/20 hover:text-primary-500"
                title="Back"
                @click.prevent="$router.back()"
              >
                <Icon name="lucide:arrow-left" class="h-5 w-5" />
              </a>
            </div>
          </div>
          <div class="flex flex-col">
            <div class="flex h-16 w-full items-center justify-center">
              <AccountMenu />
            </div>
          </div>
        </div>
      </div>
      <!-- Conversations -->
      <ChatConversationsList />
      <!-- Selected conversation -->
      <div
        class="relative w-full transition-all duration-300"
        :class="
          conversationDetailsOpen
            ? 'lg:max-w-[calc(100%_-_550px)] ltablet:max-w-[calc(100%_-_470px)]'
            : 'lg:max-w-[calc(100%_-_160px)] ltablet:max-w-[calc(100%_-_160px)]'
        "
      >
        <div class="flex w-full flex-col">
          <!-- Header -->
          <div class="flex h-16 w-full items-center justify-between px-4 sm:px-8">
            <div class="flex items-center gap-2">
              <!--<BaseInput v-model="search" shape="curved" icon="lucide:search" placeholder="Search" />-->
            </div>

            <div class="flex items-center gap-2">
              <CollapseTools />
              <button
                v-if="selectedConversation"
                class="flex h-9 w-9 items-center justify-center rounded-full border border-muted-200 bg-white text-muted-700 ring-1 ring-transparent transition-all duration-300 hover:ring-muted-200 hover:ring-offset-4 dark:border-muted-700 dark:bg-muted-800 dark:text-muted-400 dark:ring-offset-muted-900 dark:hover:ring-muted-700"
                @click="conversationDetailsOpen = !conversationDetailsOpen"
              >
                <Icon name="lucide:align-end-vertical" class="h-5 w-5" />
              </button>
            </div>
          </div>
          <!-- Encryptor widget -->
          <EncryptorWidget v-if="isEncryptorWidgetVisible" color="none" />
          <!-- Body -->
          <div
            v-else
            ref="chatEl"
            class="relative h-[calc(100vh_-_128px)] w-full p-4 sm:p-8"
            :class="isMessagesLoading ? 'overflow-hidden' : 'nui-slimscroll overflow-y-auto'"
          >
            <!-- Loader-->
            <ChatMessagesLoader :is-loading="isMessagesLoading" />

            <!-- Messages loop -->
            <div v-if="!isMessagesLoading" class="space-y-12">
              <template v-for="[index, message] in selectedConversation?.messages" :key="index">
                <!-- Separator -->
                <div v-if="canShowDateSeparator(message, index)" class="relative flex w-full justify-center gap-4">
                  <div class="absolute inset-0 flex items-center" aria-hidden="true">
                    <div class="w-full border-t border-muted-300/50 dark:border-muted-800"></div>
                  </div>
                  <div class="relative flex justify-center">
                    <span class="bg-muted-100 px-3 font-sans text-xs uppercase text-muted-400 dark:bg-muted-900">
                      {{ useFormattedDate(message.sentAt, 'D MMM') }}
                    </span>
                  </div>
                </div>
                <!-- Message -->
                <div
                  class="relative flex w-full gap-4"
                  :class="[isReceivedMessage(message) ? 'flex-row' : 'flex-row-reverse']"
                >
                  <div class="shrink-0">
                    <UserAvatar :address="message.sender" size="xs" />
                  </div>
                  <div class="flex max-w-md flex-col">
                    <div
                      class="rounded-xl bg-muted-200 p-4 dark:bg-muted-800"
                      :class="[
                        isReceivedMessage(message) ? 'rounded-ss-none' : 'rounded-se-none',
                        isTmpMessageIndex(index) ? 'animate-pulse' : '',
                      ]"
                    >
                      <p class="font-sans text-sm">{{ message.content }}</p>
                    </div>
                    <div
                      class="mt-1 font-sans text-xs text-muted-400"
                      :class="isReceivedMessage(message) ? 'text-right' : ''"
                    >
                      {{ useFormattedDate(message.sentAt, 'H:mm') }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </div>
          <!-- Compose -->
          <form
            v-if="selectedConversation && !isEncryptorWidgetVisible"
            method="POST"
            action=""
            class="flex h-16 w-full items-center bg-muted-100 px-4 dark:bg-muted-900 sm:px-8"
            @submit.prevent="submitMessage"
          >
            <div class="relative w-full">
              <BaseInput
                v-model.trim="messageInput"
                :disabled="isMessageSending"
                shape="full"
                :classes="{
                  input: 'h-12 ps-6 pe-24',
                }"
                placeholder="Write a message..."
              />
              <!--              <div class="absolute end-2 top-0 flex h-12 items-center gap-1">-->
              <!--                <button-->
              <!--                  type="button"-->
              <!--                  class="flex h-12 w-10 items-center justify-center text-muted-400 transition-colors duration-300 hover:text-primary-500"-->
              <!--                >-->
              <!--                  <Icon name="lucide:smile" class="h-5 w-5" />-->
              <!--                </button>-->
              <!--                <button-->
              <!--                  type="button"-->
              <!--                  class="flex h-12 w-10 items-center justify-center text-muted-400 transition-colors duration-300 hover:text-primary-500"-->
              <!--                >-->
              <!--                  <Icon name="lucide:paperclip" class="h-5 w-5" />-->
              <!--                </button>-->
              <!--              </div>-->
            </div>
          </form>
        </div>
      </div>
      <!-- Conversation details -->
      <ChatConversationDetails :open="conversationDetailsOpen" @close="conversationDetailsOpen = false" />
    </div>
  </div>
</template>
