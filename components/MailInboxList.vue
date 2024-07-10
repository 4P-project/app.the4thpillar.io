<script setup lang="ts">
import type { ReceivedEnvelope } from '@4thtech-sdk/types';
import { vInfiniteScroll } from '@vueuse/components';
import type { Pagination } from '~/types/pagination';

const props = defineProps<{
  pagination: Pagination<ReceivedEnvelope>;
  selectedEnvelope: ReceivedEnvelope | null;
}>();

const emit = defineEmits<{
  (e: 'envelopeSelect', envelope: ReceivedEnvelope): void;
}>();

const { isNftIntegrationEnabled, primaryNft } = usePollinationX();

const isPanelActive = useState<boolean>('is-panel-active', () => false);

const search = ref('');

const reversedEnvelopes = computed(() => [...props.pagination.items].reverse());

const filteredEnvelopes = computed(() => {
  const searchTerm = search.value.toLowerCase();

  return reversedEnvelopes.value.filter(
    (envelope) =>
      envelope.sender.toLowerCase().includes(searchTerm) ||
      envelope.content.subject.toLowerCase().includes(searchTerm) ||
      envelope.content.body?.toLowerCase().includes(searchTerm),
  );
});

const selectEnvelope = (envelope: ReceivedEnvelope) => {
  emit('envelopeSelect', envelope);
  isPanelActive.value = true;
};

const isPollinationXWidgetVisible = computed(() => isNftIntegrationEnabled && !primaryNft.value);
</script>

<template>
  <div class="flex h-full w-full flex-col pt-3 lg:w-full ltablet:w-full">
    <!-- PollinationX widget -->
    <div v-if="isPollinationXWidgetVisible" class="my-auto">
      <PollinationxWidget color="none" />
    </div>
    <!-- Show mails if any -->
    <div v-else-if="pagination.items.length" class="h-full">
      <!-- Head (search) -->
      <div class="h-16 w-full px-4 sm:px-8">
        <BaseInput
          v-model.trim="search"
          shape="curved"
          icon="lucide:search"
          :placeholder="`Search among ${pagination.items.length} mails`"
        />
      </div>
      <!-- Mails list -->
      <ul
        v-if="filteredEnvelopes.length"
        v-infinite-scroll="[pagination.fetchMore, { distance: 100, canLoadMore: pagination.canLoadMore }]"
        class="h-[calc(100%_-_64px)] space-y-2 overflow-y-auto px-4 pb-8 sm:px-8"
      >
        <li
          v-for="envelope in filteredEnvelopes"
          :key="envelope.index.toString()"
          class="duration 300 cursor-pointer rounded-xl p-4 transition-colors sm:p-6"
          :class="selectedEnvelope === envelope ? 'bg-primary-500/10' : 'hover:bg-muted-100 dark:hover:bg-muted-800'"
          @click="selectEnvelope(envelope)"
        >
          <MailInboxListItem :envelope="envelope" />
        </li>
        <!-- Loader -->
        <li v-if="pagination.isLoading" class="rounded-xl p-4 sm:p-6">
          <div class="mb-3 flex items-center gap-2">
            <BasePlaceload class="h-8 w-8 shrink-0 rounded-md" :width="32" :height="32" />
            <div class="flex w-full flex-col">
              <BasePlaceload class="mb-2 h-2 w-full max-w-[10rem] rounded" />
              <BasePlaceload class="mb-2 h-2 w-full max-w-[15rem] rounded" />
            </div>
            <div class="w-14">
              <BasePlaceload class="mb-2 h-2 w-full max-w-[5rem] rounded" />
            </div>
          </div>
          <BasePlaceload class="mb-2 h-2 w-full max-w-[15rem] rounded" />
        </li>
      </ul>
      <!-- Show placeholder if there is no mail results from search -->
      <BasePlaceholderPage
        v-else
        title="No matching results"
        subtitle="Looks like we couldn't find any matching results for your search terms. Try other search terms."
      >
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-search.svg"
            alt="Placeholder image"
          />
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-search-dark.svg"
            alt="Placeholder image"
          />
        </template>
      </BasePlaceholderPage>
    </div>
    <!-- Show placeholder if there is no email -->
    <div v-else-if="!pagination.isLoading" class="my-auto">
      <BasePlaceholderPage
        title="Your Inbox is Empty"
        subtitle="Your inbox is empty right now. Compose a new mail or wait for incoming mails to appear here."
      >
        <template #image>
          <img
            class="block dark:hidden"
            src="/img/illustrations/placeholders/flat/placeholder-empty.svg"
            alt="Placeholder image"
          />
          <img
            class="hidden dark:block"
            src="/img/illustrations/placeholders/flat/placeholder-empty.svg"
            alt="Placeholder image"
          />
        </template>
        <div class="mt-4">
          <BaseButton to="/mail/compose" color="primary" class="!h-12 w-48 items-center gap-2">
            <Icon name="lucide:plus" class="h-5 w-5" />
            Compose new
          </BaseButton>
        </div>
      </BasePlaceholderPage>
    </div>
  </div>
</template>
