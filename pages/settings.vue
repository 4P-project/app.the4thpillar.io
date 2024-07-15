<script setup lang="ts">
definePageMeta({
  title: 'Settings',
});

const tabs = [
  {
    name: 'Whitelist',
    path: '/settings',
  },
];

const { isPro } = useProVersion();
</script>

<template>
  <ProWidget v-if="!isPro" class="max-w-md" />
  <div v-else>
    <!--Tabs-->
    <div class="flex items-center justify-between overflow-hidden">
      <div class="flex grow gap-x-6 border-b border-muted-200 font-sans dark:border-muted-800 xs:overflow-x-auto">
        <NuxtLink
          v-for="tab of tabs"
          :key="tab.name"
          :to="tab.path"
          exact-active-class="!text-muted-700 dark:!text-muted-100 !border-primary-500"
          class="cursor-pointer select-none border-b-2 border-transparent pb-2 text-muted-300 transition-colors duration-300 hover:text-muted-400 dark:text-muted-500 dark:hover:text-muted-400"
        >
          {{ tab.name }}
        </NuxtLink>
      </div>
    </div>

    <!--Tab content-->
    <div class="w-full py-6">
      <NuxtPage />
    </div>
  </div>
</template>
