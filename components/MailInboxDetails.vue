<script setup lang="ts">
import type { ReceivedEnvelope } from '@4thtech-sdk/types';
import { saveAs } from 'file-saver';
import { useToast } from 'vue-toastification';

const { mailClient } = useMail();
const toast = useToast();

const isPanelActive = useState<boolean>('is-panel-active');
const selectedEnvelope = useState<ReceivedEnvelope>('selected-envelope');
const replyContent = useState<string>('reply-content');

const replyMessage = ref();

const onReplyClick = () => {
  if (replyMessage) {
    replyContent.value = replyMessage.value;
  }

  navigateTo('/mail/compose?reply=true');
};

const onForwardClick = () => {
  navigateTo('/mail/compose?forward=true');
};

const onArchiveClick = () => {
  const jsonString = JSON.stringify(
    selectedEnvelope.value,
    (_key, value) => (typeof value === 'bigint' ? value.toString() : value),
    2,
  );
  const fileData = new Blob([jsonString], { type: 'application/json' });
  const fileName = `${selectedEnvelope.value.sender}-${selectedEnvelope.value.index}`;

  saveAs(fileData, fileName);
};

// const onInfoClick = () => {
// };

const onDeleteClick = () => {
  mailClient.value.deleteMail(selectedEnvelope.value.index).catch((error) => toast.error(error.message));
  // selectedEnvelope.value = undefined;
  isPanelActive.value = false;
};

const mailActionIcons = [
  { iconName: 'ph:arrow-arc-left-duotone', tooltip: 'Reply', onClick: onReplyClick },
  { iconName: 'ph:arrow-arc-right-duotone', tooltip: 'Reply', onClick: onForwardClick },
  { iconName: 'ph:archive-box-duotone', tooltip: 'Archive', onClick: onArchiveClick },
  // { iconName: 'ph:info-duotone', tooltip: 'Info', onClick: onInfoClick },
  { iconName: 'ph:trash-duotone', tooltip: 'Delete', onClick: onDeleteClick },
];
</script>

<template>
  <div
    class="fixed end-0 top-0 flex h-full flex-col border-l border-muted-200 bg-white transition-transform duration-300 dark:border-muted-700/40 dark:bg-muted-800 lg:static lg:grow ltablet:static ltablet:grow"
    :class="isPanelActive ? 'translate-x-0' : 'translate-x-full lg:translate-x-0 ltablet:translate-x-0'"
  >
    <div v-if="selectedEnvelope" class="mx-auto w-full lg:max-w-5xl ltablet:max-w-5xl">
      <!-- Toolbar -->
      <div class="relative z-10 flex h-16 w-full items-center justify-between px-8">
        <div class="flex items-center gap-2 text-muted-700 dark:text-muted-300">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center lg:hidden ltablet:hidden"
            @click="isPanelActive = false"
          >
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </button>
          <BaseHeading size="2xl">
            <span>Inbox</span>
          </BaseHeading>
        </div>
        <CollapseTools />
      </div>

      <!-- Mail header -->
      <div
        class="flex h-24 flex-col justify-between border-b border-muted-200 px-8 dark:border-muted-700 lg:flex-row lg:items-center ltablet:flex-row ltablet:items-center"
      >
        <div class="flex items-center gap-x-4">
          <div class="hidden lg:block ltablet:block">
            <UserAvatar :address="selectedEnvelope.sender" size="lg" />
          </div>
          <div class="block lg:hidden ltablet:hidden">
            <UserAvatar :address="selectedEnvelope.sender" size="sm" />
          </div>
          <div class="flex flex-col font-sans">
            <h3 class="text-lg font-semibold">
              {{ selectedEnvelope.sender }}
            </h3>
            <p class="text-sm text-muted-400">
              {{ selectedEnvelope.sender }}
            </p>
          </div>
        </div>
        <div>
          <!-- Mail actions -->
          <div class="mb-2 flex gap-x-2 lg:mb-0 ltablet:mb-0">
            <BaseButtonGroup>
              <BaseButtonIcon
                v-for="(button, index) in mailActionIcons"
                :key="index"
                class="h-5 w-5"
                :data-nui-tooltip="button.tooltip"
                @click="button.onClick"
              >
                <Icon :name="button.iconName" class="h-4 w-4" />
              </BaseButtonIcon>
            </BaseButtonGroup>
          </div>
        </div>
      </div>
      <!-- Mail body -->
      <div class="nui-slimscroll h-[calc(100vh_-_344px)] overflow-y-auto p-8 pt-4">
        <div class="text-right text-sm text-muted-400">
          <time :datetime="selectedEnvelope.sentAt.toDateString()">{{
            useFormattedDate(selectedEnvelope.sentAt)
          }}</time>
        </div>
        <h1 class="text-2xl font-bold">{{ selectedEnvelope.content.subject }}</h1>
        <article class="mt-8 leading-7 tracking-wider text-muted-500 dark:text-muted-400">
          <p class="whitespace-pre-wrap font-sans">
            {{ selectedEnvelope.content.body }}
          </p>
        </article>
        <!-- Mail attachments -->
        <div v-if="selectedEnvelope.content.attachments" class="mt-24 grid grid-cols-1 gap-4 sm:grid-cols-4">
          <AttachmentsList :attachments="selectedEnvelope.content.attachments" />
        </div>
      </div>
      <!-- Mail reply -->
      <div class="relative flex h-44 w-full items-center justify-center px-8">
        <div
          class="mb-3 w-full rounded-xl border border-muted-200 bg-muted-50 outline-none outline-offset-4 transition-all duration-300 focus-within:outline-dashed focus-within:outline-2 focus-within:outline-muted-200 dark:border-muted-700/40 dark:bg-muted-900 dark:focus-within:outline-muted-700"
        >
          <textarea
            v-model="replyMessage"
            class="w-full resize-none rounded-2xl bg-muted-50 p-3 font-sans outline-none placeholder:text-muted-300 dark:bg-muted-900 dark:placeholder:text-muted-600"
            placeholder="Type your reply here..."
            rows="2"
          ></textarea>
          <div class="flex items-center justify-end p-3">
            <BaseButton shape="curved" color="primary" class="w-24" @click="onReplyClick">
              <span>Reply</span>
            </BaseButton>
          </div>
        </div>
      </div>
    </div>
    <!-- Show placeholder if no email is selected -->
    <div v-else class="mx-auto my-auto w-full lg:max-w-5xl ltablet:max-w-5xl">
      <BasePlaceholderPage title="No Email Selected" subtitle="Select an email from the list to show it's content.">
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-choice.svg"
            alt="Placeholder image"
          />
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-choice.svg"
            alt="Placeholder image"
          />
        </template>
      </BasePlaceholderPage>
    </div>
  </div>
</template>
