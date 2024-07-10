<script setup lang="ts">
import type { Attachment, RemoteFileInfo } from '@4thtech-sdk/types';

defineProps<{
  attachments: Attachment[];
}>();

const { mailClient } = useMailClient();

const downloadFile = async (attachment: RemoteFileInfo) => {
  const fileContent = await mailClient.value.downloadAttachment(attachment);

  const blob = new Blob([fileContent], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = attachment.name;
  link.click();

  URL.revokeObjectURL(url);
};
</script>

<template>
  <button
    v-for="(file, index) in attachments"
    :key="index"
    type="button"
    class="group flex items-center gap-3 rounded-xl p-2 text-left transition-colors duration-300 hover:bg-muted-100/80 dark:hover:bg-muted-700/60"
    @click="downloadFile(file)"
  >
    <img class="h-11 w-11" :src="getFileIcon(file.type || file.name)" :alt="`${file.name}`" />
    <span class="block font-sans">
      <span class="block text-sm font-semibold text-muted-800 dark:text-muted-100">
        {{ file.name }}
      </span>
      <span v-if="file.size" class="block text-xs text-muted-400">
        {{ formatFileSize(file.size) }}
      </span>
    </span>
    <span class="ms-auto block">
      <span
        class="me-3 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100"
      >
        <Icon name="lucide:arrow-down" class="h-4 w-4 text-primary-500" />
      </span>
    </span>
  </button>
</template>
