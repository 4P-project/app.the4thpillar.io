<script setup lang="ts">
const { conversations, selectedConversation, onConversationSelect } = useChat();

const newConversationModalOpen = ref(false);
</script>

<template>
  <div
    class="relative z-[9] h-screen w-16 overflow-y-auto border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 sm:w-20 lg:border-r ltablet:border-r"
  >
    <div class="flex h-full flex-col">
      <button
        class="flex h-16 w-16 shrink-0 items-center justify-center sm:w-20"
        @click="newConversationModalOpen = true"
      >
        <span class="flex h-10 w-10 items-center justify-center rounded-full bg-primary-500 text-white">
          <Icon name="lucide:plus" class="h-4 w-4" />
        </span>
      </button>
      <!-- List -->
      <a
        v-for="[conversationHash, conversation] in conversations"
        :key="conversationHash"
        href="#"
        class="flex h-16 w-16 shrink-0 items-center justify-center border-s-2 sm:w-20"
        :class="selectedConversation?.hash === conversationHash ? 'border-primary-500' : 'border-transparent'"
        :data-nui-tooltip="conversation.name"
        data-nui-tooltip-position="right"
        @click.prevent="onConversationSelect(conversationHash)"
      >
        <ConversationAvatar :hash="conversationHash" />
      </a>
    </div>
  </div>

  <!-- New conversation modal -->
  <ChatNewConversation :open="newConversationModalOpen" @close="newConversationModalOpen = false" />
</template>
