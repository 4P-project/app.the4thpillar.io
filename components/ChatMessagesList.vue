<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';
import type { ReceivedMessage } from '@4thtech-sdk/types';
import type { Pagination } from '~/types/pagination';
import { isTmpMessageIndex, type TmpMessageIndex, type TmpSentMessage } from '~/types/chat';

const props = defineProps<{
  pagination: Pagination<ReceivedMessage | TmpSentMessage>;
}>();

const { address } = useAccount();
const messagesContainer = ref<HTMLElement | null>(null);
const userScrolled = ref(false);

const isReceivedMessage = (message: ReceivedMessage | TmpSentMessage) => message.sender !== address.value;

const canShowDateSeparator = (message: ReceivedMessage | TmpSentMessage, index: number | TmpMessageIndex) => {
  if (typeof index !== 'number') {
    return false;
  }

  const messages = props.pagination.items;

  // Check for existence and non-emptiness of messages
  if (!messages || messages.length === 0) {
    return false;
  }

  // Always show separator for the first message in a conversation
  if (index === 0) {
    return true;
  }

  const previousMessage = messages[index - 1];
  if (!previousMessage) {
    return false;
  }

  // Compare dates of the current message and the previous one
  const currentMessageDate = message.sentAt.toDateString();
  const previousMessageDate = previousMessage.sentAt.toDateString();

  return currentMessageDate !== previousMessageDate;
};

watch(
  () => props.pagination.items.length,
  () => {
    const container = messagesContainer.value;
    if (container) {
      // Track the current scroll position and container height
      const currentScrollTop = container.scrollTop;
      const currentScrollHeight = container.scrollHeight;

      nextTick(() => {
        // Calculate the new scroll height after messages are loaded
        const newScrollHeight = container.scrollHeight;

        // Adjust the scroll position by the change in scroll height or scroll to the bottom
        container.scrollTop = userScrolled.value
          ? currentScrollTop + (newScrollHeight - currentScrollHeight)
          : newScrollHeight;
      });
    }
  },
);

const setupScrollTracking = () => {
  const container = messagesContainer.value;
  if (container) {
    const handleScroll = () => {
      // Check if the user has scrolled away from the bottom
      if (container.scrollTop + container.clientHeight < container.scrollHeight) {
        userScrolled.value = true;
      }
    };

    container.addEventListener('scroll', handleScroll);

    // Clean up event listener when the component is unmounted
    onBeforeUnmount(() => {
      container.removeEventListener('scroll', handleScroll);
    });
  }
};

onMounted(() => {
  setupScrollTracking();
});
</script>

<template>
  <div class="relative h-[calc(100vh_-_128px)] w-full">
    <!-- Loader-->
    <!-- <ChatMessagesLoader :is-loading="pagination.isLoading" /> -->

    <!-- Messages loop -->
    <div
      ref="messagesContainer"
      v-infinite-scroll="[
        pagination.fetchMore,
        { distance: 50, canLoadMore: pagination.canLoadMore, direction: 'top' },
      ]"
      class="nui-slimscroll h-full overflow-y-auto p-4 sm:p-8"
    >
      <template v-for="(message, index) in pagination.items" :key="message.index.toString()">
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
        <div class="relative flex w-full gap-4" :class="[isReceivedMessage(message) ? 'flex-row' : 'flex-row-reverse']">
          <div class="shrink-0">
            <UserAvatar :address="message.sender" size="xs" />
          </div>
          <div class="flex max-w-md flex-col">
            <div
              class="rounded-xl bg-muted-200 p-4 dark:bg-muted-800"
              :class="[
                isReceivedMessage(message) ? 'rounded-ss-none' : 'rounded-se-none',
                isTmpMessageIndex(message.index) ? 'animate-pulse' : '',
              ]"
            >
              <p class="font-sans text-sm">{{ message.content }}</p>
            </div>
            <div class="mt-1 font-sans text-xs text-muted-400" :class="isReceivedMessage(message) ? 'text-right' : ''">
              {{ useFormattedDate(message.sentAt, 'H:mm') }}
            </div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>
