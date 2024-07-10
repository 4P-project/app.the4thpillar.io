<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';
import type { Pagination } from '~/types/pagination';
import type { Conversation } from '~/types/chat';

const props = defineProps<{
  pagination: Pagination<Conversation>;
  selectedConversation: Conversation | null;
}>();

const emit = defineEmits<{
  (e: 'conversationSelect', conversation: Conversation): void;
}>();

const newConversationModalOpen = ref(false);

const reversedConversations = computed(() => [...props.pagination.items].reverse());
</script>

<template>
  <div
    class="flex h-full w-full flex-col border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 sm:w-20 lg:border-r ltablet:border-r"
  >
    <div class="h-full">
      <button
        class="flex h-16 w-16 shrink-0 items-center justify-center sm:w-20"
        @click="newConversationModalOpen = true"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white">
          <Icon name="lucide:plus" class="h-4 w-4" />
        </span>
      </button>
      <!-- List -->
      <ul
        v-infinite-scroll="[pagination.fetchMore, { distance: 10, canLoadMore: pagination.canLoadMore }]"
        class="nui-slimscroll h-[calc(100%_-_64px)] overflow-y-auto overflow-x-hidden"
      >
        <li
          v-for="conversation in reversedConversations"
          :key="conversation.hash"
          class="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center border-s-2 sm:w-20"
          :class="selectedConversation?.hash === conversation.hash ? 'border-primary-500' : 'border-transparent'"
          :data-nui-tooltip="conversation.name"
          data-nui-tooltip-position="right"
          @click="emit('conversationSelect', conversation)"
        >
          <ConversationAvatar :hash="conversation.hash" />
        </li>
        <!-- Loader -->
        <li
          v-if="pagination.isLoading"
          class="flex h-16 w-16 shrink-0 cursor-pointer items-center justify-center border-s-2 sm:w-20"
        >
          <BasePlaceload class="h-10 w-10 shrink-0 rounded-full" :width="40" :height="40" />
        </li>
      </ul>
    </div>
  </div>

  <!-- New conversation modal -->
  <ChatNewConversation :open="newConversationModalOpen" @close="newConversationModalOpen = false" />
</template>
