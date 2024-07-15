<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';
import type { Conversation } from '~/types/chat';

defineProps<{
  conversation: Conversation;
}>();

const { canAddMembers } = useAddChatMembers();
const { removeMember, canRemoveMember } = useRemoveChatMembers();
const { truncateMiddleText } = useText();

const newMembersModalOpen = ref(false);
</script>

<template>
  <div
    :key="conversation.hash"
    v-infinite-scroll="[
      conversation.members.fetchMore,
      { distance: 10, canLoadMore: () => conversation.members.canLoadMore() },
    ]"
    class="nui-slimscroll mt-6 max-h-screen overflow-y-auto"
  >
    <div class="mb-3 flex items-center justify-center gap-2 px-4">
      <span class="font-sans text-sm text-muted-400">Members</span>
      <BaseButtonIcon v-if="canAddMembers(conversation)" size="sm" @click="newMembersModalOpen = true">
        <Icon name="ph:user-plus" class="h-4 w-4" />
      </BaseButtonIcon>
    </div>
    <div v-for="member in conversation.members.items" :key="member" class="mb-3 flex items-center gap-2 truncate">
      <UserAvatar :address="member" size="xs" shape="full" class="pointer-events-none" />
      <div class="pointer-events-none">
        <BaseHeading size="sm" weight="semibold" lead="tight">
          <span>{{ truncateMiddleText(member, 25) }}</span>
        </BaseHeading>
        <BaseParagraph v-if="conversation.creator === member" size="xs" lead="none" class="text-left">
          <span class="text-muted-500 dark:text-muted-400">Creator</span>
        </BaseParagraph>
      </div>
      <div class="ms-auto">
        <Icon
          v-if="canRemoveMember(conversation, member)"
          name="ph:trash"
          class="h-4 w-4 text-muted-400 hover:cursor-pointer hover:text-muted-800 dark:hover:text-white"
          @click="removeMember(conversation, member)"
        />
      </div>
    </div>
    <!-- Loader -->
    <div v-if="conversation.members.isLoading" class="mb-3 flex items-center gap-2">
      <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
      <div class="flex w-full flex-col items-center">
        <div class="flex w-full flex-col">
          <BasePlaceload class="mb-2 h-2 w-full max-w-[15rem] rounded" />
          <BasePlaceload class="mb-2 h-2 w-full max-w-[4rem] rounded" />
        </div>
      </div>
    </div>
  </div>
  <!-- Add members modal -->
  <ChatAddMembers :conversation="conversation" :open="newMembersModalOpen" @close="newMembersModalOpen = false" />
</template>
