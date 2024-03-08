<script setup lang="ts">
import type { ConversationHash } from '@4thtech-sdk/types';

defineProps<{
  hash: ConversationHash;
}>();
</script>

<template>
  <UserAvatar :address="hash" size="sm" />
</template>
