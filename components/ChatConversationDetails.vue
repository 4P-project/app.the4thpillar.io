<script setup lang="ts">
defineProps<{ open: boolean }>();

const { selectedConversation: conversation } = useChat();

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};
</script>

<template>
  <div
    class="fixed end-0 top-0 z-20 h-full w-[390px] bg-white transition-transform duration-300 dark:bg-muted-800 ltablet:w-[310px]"
    :class="open ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex h-16 w-full items-center justify-between px-8">
      <BaseHeading tag="h3" size="lg" class="text-muted-800 dark:text-white">
        <span>Conversation details</span>
      </BaseHeading>
      <BaseButtonIcon small @click="close()">
        <Icon name="lucide:arrow-right" class="pointer-events-none h-4 w-4" />
      </BaseButtonIcon>
    </div>
    <div class="relative flex w-full flex-col px-8">
      <!-- Loader -->
      <div v-if="false" class="mt-8">
        <div class="mb-3 flex items-center justify-center">
          <BasePlaceload class="h-24 w-24 shrink-0 rounded-full" :width="96" :height="96" />
        </div>
        <div class="flex flex-col items-center">
          <BasePlaceload class="mb-2 h-3 w-full max-w-[10rem] rounded" />
          <BasePlaceload class="mb-2 h-3 w-full max-w-[6rem] rounded" />
          <div class="my-4 flex w-full flex-col items-center">
            <BasePlaceload class="mb-2 h-2 w-full max-w-[15rem] rounded" />
            <BasePlaceload class="mb-2 h-2 w-full max-w-[13rem] rounded" />
          </div>
          <div class="mb-6 flex w-full items-center justify-center">
            <div class="px-4">
              <BasePlaceload class="h-3 w-[3.5rem] rounded" />
            </div>
            <div class="px-4">
              <BasePlaceload class="h-3 w-[3.5rem] rounded" />
            </div>
          </div>
          <div class="w-full">
            <BasePlaceload class="h-10 w-full rounded-xl" />
            <BasePlaceload class="mx-auto mt-3 h-3 w-[7.5rem] rounded" />
          </div>
        </div>
      </div>
      <!-- User details -->
      <div v-else-if="conversation" class="mt-8">
        <div class="flex items-center justify-center">
          <ConversationAvatar :hash="conversation.hash" size="2xl" />
        </div>
        <div class="text-center">
          <BaseHeading tag="h3" size="lg" class="mt-4">
            <span>{{ conversation.name }}</span>
          </BaseHeading>
          <BaseParagraph size="sm" class="text-muted-400">
            <span v-if="conversation.isGroup">Group conversation</span>
            <span v-else>1-to-1 conversation</span>
          </BaseParagraph>
          <div class="my-4 flex items-center justify-center divide-x divide-muted-200 dark:divide-muted-700">
            <div class="flex items-center justify-center gap-2 px-4">
              <Icon name="ph:users" class="h-4 w-4 text-muted-400" />
              <span class="font-sans text-xs text-muted-400">Members: {{ conversation.members.length }}</span>
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
          <!--          <div class="mt-6">-->
          <!--                                            <BaseButton shape="curved" class="w-full">-->
          <!--                                              <span> View {{ conversation.name }}'s profile </span>-->
          <!--                                            </BaseButton>-->
          <!--                                            <button class="mt-3 font-sans text-sm text-primary-500 underline-offset-4 hover:underline">-->
          <!--                                              Send a friend request-->
          <!--                                            </button>-->
          <!--          </div>-->
        </div>
      </div>
    </div>
  </div>
</template>
