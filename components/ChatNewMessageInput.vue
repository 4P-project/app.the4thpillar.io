<script setup lang="ts">
import { useToast } from 'vue-toastification';
import type { Conversation } from '~/types/chat';

const props = defineProps<{
  selectedConversation: Conversation;
}>();

const { sendMessage } = useSendChatMessage();
const toast = useToast();

const messageInput = ref('');
const isMessageSending = ref(false);

const submitMessage = async () => {
  if (!messageInput.value) return;
  if (props.selectedConversation.messages.isLoading) return;

  isMessageSending.value = true;

  try {
    await sendMessage(props.selectedConversation, messageInput.value);
    messageInput.value = '';
  } catch (error) {
    toast.error(error instanceof Error ? error.message : 'An unexpected error occurred');
  } finally {
    isMessageSending.value = false;
  }
};
</script>

<template>
  <form
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
        :classes="{ input: 'h-12 ps-6 pe-24' }"
        placeholder="Write a message..."
      />
      <!--      <div class="absolute end-2 top-0 flex h-12 items-center gap-1">-->
      <!--        <button-->
      <!--          type="button"-->
      <!--          class="flex h-12 w-10 items-center justify-center text-muted-400 transition-colors duration-300 hover:text-primary-500"-->
      <!--        >-->
      <!--          <Icon name="lucide:smile" class="h-5 w-5" />-->
      <!--        </button>-->
      <!--        <button-->
      <!--          type="button"-->
      <!--          class="flex h-12 w-10 items-center justify-center text-muted-400 transition-colors duration-300 hover:text-primary-500"-->
      <!--        >-->
      <!--          <Icon name="lucide:paperclip" class="h-5 w-5" />-->
      <!--        </button>-->
      <!--      </div>-->
    </div>
  </form>
</template>
