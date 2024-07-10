<script setup lang="ts">
import ChatMessagesList from '~/components/ChatMessagesList.vue';
import ChatNewMessageInput from '~/components/ChatNewMessageInput.vue';

definePageMeta({
  title: 'Chat',
  layout: 'empty',
});

const { address } = useAccount();
const chatStore = useChatStore();
const { selectedConversation } = storeToRefs(chatStore);
const { isReadyToUse: isEncryptorReadyToUse } = useEncryptor();

const conversationDetailsOpen = ref(false);
// const search = ref('');

const isEncryptorWidgetVisible = computed(
  () => !isEncryptorReadyToUse.value && selectedConversation.value?.isEncrypted,
);
</script>

<template>
  <div class="flex h-screen bg-muted-100 dark:bg-muted-900">
    <ChatSidebar />

    <ChatConversationsList
      :key="address"
      :pagination="chatStore.conversations"
      :selected-conversation="selectedConversation"
      @conversation-select="chatStore.selectConversation"
    />

    <!-- Selected conversation -->
    <div
      class="w-full transition-all duration-300"
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
        <template v-if="selectedConversation">
          <EncryptorWidget v-if="isEncryptorWidgetVisible" color="none" />
          <template v-else>
            <ChatMessagesList
              v-if="selectedConversation.messages"
              :key="selectedConversation.hash"
              :pagination="selectedConversation.messages"
            />
            <ChatNewMessageInput :selected-conversation="selectedConversation" />
          </template>
        </template>
      </div>
    </div>

    <ChatConversationDetails
      v-if="selectedConversation"
      :conversation="selectedConversation"
      :open="conversationDetailsOpen"
      @close="conversationDetailsOpen = false"
    />
  </div>
</template>
