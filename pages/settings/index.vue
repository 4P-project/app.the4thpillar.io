<script setup lang="ts">
import { vInfiniteScroll } from '@vueuse/components';

const settingsStore = useSettingsStore();
const { removeAccounts } = useRemoveMailWhitelistAccounts();

const addAccountsModalOpen = ref(false);
</script>

<template>
  <div>
    <!--Placeholder-->
    <PlaceholderMinimal
      v-if="!settingsStore.whitelistedAccounts.items.length"
      title="You currently have no whitelisted accounts"
      description="Whitelist accounts to ensure only approved accounts can send you mails. Once whitelisted, you can manage these accounts from here."
    >
      <div class="mt-3 flex justify-center">
        <BaseButton color="primary" class="w-48" @click="addAccountsModalOpen = true">Whitelist an Account</BaseButton>
      </div>
    </PlaceholderMinimal>

    <!-- Show data here -->
    <template v-else>
      <!--Header-->
      <div class="flex items-center justify-end">
        <div class="hidden items-center gap-2 md:flex">
          <BaseButton size="sm" @click="addAccountsModalOpen = true">
            <Icon name="ph:user-circle-plus" class="h-5 w-5" />
            <span>Add accounts</span>
          </BaseButton>
        </div>
      </div>
      <!--Accounts list-->
      <ul
        v-infinite-scroll="[
          settingsStore.whitelistedAccounts.fetchMore,
          { distance: 50, canLoadMore: () => settingsStore.whitelistedAccounts.canLoadMore() },
        ]"
      >
        <!--Header-->
        <li>
          <div class="flex w-full max-w-2xl gap-x-4 border-b border-muted-200 px-3 py-2 dark:border-muted-800">
            <div class="w-4/5">
              <span class="mb-1 font-heading text-xs text-muted-400">Account</span>
            </div>
          </div>
        </li>
        <li v-for="account in settingsStore.whitelistedAccounts.items" :key="account">
          <div class="flex w-full max-w-2xl items-center gap-x-4 border-b border-muted-200 py-4 dark:border-muted-800">
            <div class="w-4/5">
              <div class="flex w-full items-center gap-3">
                <UserAvatar :address="account" size="xs" shape="full" class="pointer-events-none" />
                <BaseText size="sm" class="text-muted-800 dark:text-muted-200">
                  {{ account }}
                </BaseText>
              </div>
            </div>
            <div class="w-1/5">
              <Icon
                name="ph:trash"
                class="h-4 w-4 text-muted-400 hover:cursor-pointer hover:text-muted-800 dark:hover:text-white"
                @click="removeAccounts([account])"
              />
            </div>
          </div>
        </li>
      </ul>
    </template>

    <!-- Add whitelisted accounts modal -->
    <MailAddWhitelistedAccounts :open="addAccountsModalOpen" @close="addAccountsModalOpen = false" />
  </div>
</template>
