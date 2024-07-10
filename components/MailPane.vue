<script setup lang="ts">
import { Pane, Splitpanes } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import type { ReceivedEnvelope } from '@4thtech-sdk/types';
import type { Pagination } from '~/types/pagination';

const props = defineProps<{
  pagination: Pagination<ReceivedEnvelope>;
  selectedEnvelope: ReceivedEnvelope | null;
  envelopeSelect: (envelope: ReceivedEnvelope) => void;
}>();

const { md } = useTailwindBreakpoints();

const split = ref();
const paneSize = ref(35);

const hasMails = computed(() => props.pagination.items.length > 0);

watch(
  md,
  async (isMd) => {
    await nextTick();
    if (isMd) {
      paneSize.value = 35;
    } else {
      paneSize.value = 100;
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="flex h-screen w-full overflow-hidden bg-muted-50 dark:bg-muted-900">
    <!-- Sidebar -->
    <MailSidebar />

    <!-- Content -->
    <ClientOnly>
      <Splitpanes ref="split" @resize="paneSize = $event[0].size">
        <Pane :size="hasMails ? paneSize : 100" :min-size="md ? 30 : 100" :max-size="md ? 50 : 100">
          <MailInboxList
            :pagination="pagination"
            :selected-envelope="selectedEnvelope"
            @envelope-select="envelopeSelect"
          />
        </Pane>
        <Pane v-if="hasMails" :size="100 - paneSize">
          <MailInboxDetails :envelope="selectedEnvelope" />
        </Pane>
      </Splitpanes>
    </ClientOnly>
  </div>
</template>

<style>
.splitpanes--vertical > .splitpanes__splitter {
  @apply w-1 bg-muted-100 transition-colors duration-100 hover:bg-muted-200 dark:bg-muted-700/50 dark:hover:bg-muted-700;
}
</style>
