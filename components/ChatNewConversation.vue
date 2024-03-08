<script setup lang="ts">
defineProps<{ open: boolean }>();

const emit = defineEmits(['close']);

enum ConversationType {
  OneToOne = '1-to-1',
  Group = 'group',
}

const conversationOption = ref<ConversationType>(ConversationType.OneToOne);

const closeModal = () => {
  emit('close');
};
</script>

<template>
  <ModalDialog :open="open" size="lg" @close="closeModal">
    <template #header>
      <!-- Header -->
      <div class="flex w-full items-center justify-between p-4 md:p-6">
        <h3 class="font-heading text-lg font-medium leading-6 text-muted-900 dark:text-white">New conversation</h3>

        <BaseButtonClose @click="closeModal" />
      </div>
    </template>

    <!-- Body -->
    <div class="p-4 pt-0 md:p-6 md:pt-0">
      <!-- 1-to-1 conversation -->
      <div>
        <div
          role="button"
          class="flex cursor-pointer items-center px-8 py-5"
          :class="conversationOption === ConversationType.OneToOne ? 'bg-muted-50 dark:bg-muted-900/60' : ''"
          @click="conversationOption = ConversationType.OneToOne"
        >
          <div
            class="h-4 w-4 rounded-full border-2 border-white ring-2 transition-colors dark:border-muted-800"
            :class="
              conversationOption === ConversationType.OneToOne ? 'bg-primary-600 ring-primary-600' : 'ring-muted-400'
            "
          ></div>
          <label class="ms-4 text-sm font-medium">1 to 1</label>
        </div>
        <ChatOneToOneConversationForm v-show="conversationOption === ConversationType.OneToOne" @close="closeModal" />
      </div>
      <!-- Group conversation -->
      <div class="border-t border-muted-200 dark:border-muted-700">
        <div
          role="button"
          class="flex cursor-pointer items-center px-8 py-5"
          :class="conversationOption === ConversationType.Group ? 'bg-muted-50 dark:bg-muted-900/60' : ''"
          @click="conversationOption = ConversationType.Group"
        >
          <div
            class="h-4 w-4 rounded-full border-2 border-white ring-2 dark:border-muted-800"
            :class="
              conversationOption === ConversationType.Group ? 'bg-primary-600 ring-primary-600' : 'ring-muted-400'
            "
          ></div>
          <label class="ms-4 text-sm font-medium">Group</label>
        </div>
        <ChatGroupConversationForm v-show="conversationOption === ConversationType.Group" @close="closeModal" />
      </div>
    </div>
  </ModalDialog>
</template>
