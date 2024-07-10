<script setup lang="ts">
import type { Conversation } from '~/types/chat';
import { useChatConversationName } from '~/composables/useChatConversationName';

defineProps<{
  open: boolean;
  conversation: Conversation;
}>();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<template>
  <div
    class="fixed end-0 top-0 z-20 h-full w-[390px] overflow-y-auto bg-white transition-transform duration-300 dark:bg-muted-800 ltablet:w-[310px]"
    :class="open ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex flex-col">
      <div class="flex h-16 w-full items-center justify-between px-8">
        <BaseHeading tag="h3" size="lg" class="text-muted-800 dark:text-white">
          <span>Conversation details</span>
        </BaseHeading>
        <BaseButtonIcon small @click="close()">
          <Icon name="lucide:arrow-right" class="pointer-events-none h-4 w-4" />
        </BaseButtonIcon>
      </div>
      <div class="flex grow flex-col px-8">
        <div class="mt-8 flex items-center justify-center">
          <ConversationAvatar :hash="conversation.hash" size="2xl" />
        </div>
        <div class="text-center">
          <BaseHeading tag="h3" size="lg" class="mt-4 truncate">
            <span>{{ useChatConversationName(conversation) }}</span>
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400">
            <span v-if="conversation.isGroup">Group conversation</span>
            <span v-else>1-to-1 conversation</span>
          </BaseParagraph>
          <div class="my-4 flex items-center justify-center divide-x divide-muted-200 dark:divide-muted-700">
            <div class="flex items-center justify-center gap-2 px-4">
              <Icon name="ph:users" class="h-4 w-4 text-muted-400" />
              <span class="font-sans text-xs text-muted-400">Members: {{ conversation.members.totalCount }}</span>
            </div>
            <div class="flex items-center justify-center gap-2 px-4">
              <Icon
                :name="conversation.isEncrypted ? 'ph:lock-key' : 'ph:lock-key-open'"
                class="h-4 w-4 text-muted-400"
              />
              <span class="font-sans text-xs text-muted-400">{{
                conversation.isEncrypted ? 'Encrypted' : 'Not encrypted'
              }}</span>
            </div>
          </div>
        </div>
        <ChatMembersList :conversation="conversation" />
      </div>
    </div>
  </div>
</template>
