<script setup lang="ts">
import ChatAddMembers from '~/components/ChatAddMembers.vue';

defineProps<{ open: boolean }>();

const { address } = useAccount();
const { selectedConversation: conversation, removeMember } = useChat();

const emit = defineEmits(['close']);

const newMemebersModalOpen = ref(false);

const close = () => {
  emit('close');
};

const truncateMiddleText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) {
    return text;
  }

  const start = text.substring(0, maxLength / 2 - 2);
  const end = text.substring(text.length - maxLength / 2 + 2);
  return `${start}...${end}`;
};

const canAddMembers = () => {
  const { isGroup, creator, isOnlyCreatorAllowedToAddMembers } = conversation.value || {};

  if (!isGroup) {
    return false;
  }

  //  Allow adding members if the current user is the creator or if anyone can add members
  return creator === address.value || !isOnlyCreatorAllowedToAddMembers;
};

const canRemoveMember = (member: string) => {
  const { isGroup, creator } = conversation.value || {};

  if (!isGroup) {
    return false;
  }

  // If member is removing themselves or the group creator is performing the action
  return member === address.value || creator === address.value;
};
</script>

<template>
  <div
    class="fixed end-0 top-0 z-20 h-full w-[390px] overflow-y-auto bg-white transition-transform duration-300 dark:bg-muted-800 ltablet:w-[310px]"
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
      <!-- Conversation details -->
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
          <div class="mt-6">
            <div class="mb-3 flex items-center justify-center gap-2 px-4">
              <span class="font-sans text-sm text-muted-400">Members</span>
              <BaseButtonIcon v-if="canAddMembers()" size="sm" @click="newMemebersModalOpen = true">
                <Icon name="ph:user-plus" class="h-4 w-4" />
              </BaseButtonIcon>
            </div>
            <div v-for="member in conversation.members" :key="member" class="mb-3 flex items-center gap-2 truncate">
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
                  v-if="canRemoveMember(member)"
                  name="ph:trash"
                  class="h-4 w-4 text-muted-400 hover:cursor-pointer hover:text-muted-800 dark:hover:text-white"
                  @click="removeMember(member)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add members modal -->
  <ChatAddMembers :open="newMemebersModalOpen" @close="newMemebersModalOpen = false" />
</template>
