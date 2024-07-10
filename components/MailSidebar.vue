<script setup lang="ts">
const navigation = [
  { title: 'Compose new mail', to: '/mail/compose', icon: 'ph:plus' },
  { title: 'Inbox', to: '/mail/inbox', icon: 'ph:tray-duotone' },
  { title: 'Sent', to: '/mail/sent', icon: 'ph:paper-plane-tilt-duotone' },
];
</script>

<template>
  <div
    class="flex w-20 flex-col items-center border-r border-muted-200 bg-white dark:border-muted-700/40 dark:bg-muted-800"
  >
    <NuxtLink to="/dashboard" class="flex h-16 w-16 items-center justify-center">
      <LogoIcon class="h-10 text-primary-600" />
    </NuxtLink>
    <nav class="relative flex h-full flex-col">
      <NuxtLink
        v-for="item in navigation"
        :key="item.title"
        :to="item.to"
        :data-nui-tooltip="item.title"
        data-nui-tooltip-position="right"
        class="relative flex h-16 w-16 items-center justify-center"
      >
        <div
          class="relative flex h-12 w-12 items-center justify-center rounded-xl"
          :class="[
            $route.path === item.to
              ? 'bg-primary-500/10 text-primary-500'
              : 'bg-muted-100 text-muted-600 dark:bg-muted-700/60 dark:text-muted-400',
          ]"
        >
          <Icon :name="item.icon" class="h-5 w-5" />
        </div>
      </NuxtLink>
      <div class="mt-auto flex flex-col items-center">
        <a
          href="#"
          class="relative flex h-16 w-16 items-center justify-center"
          title="Back"
          @click.prevent="$router.back()"
        >
          <div
            class="relative flex h-12 w-12 items-center justify-center rounded-xl bg-muted-100 text-muted-600 dark:bg-muted-700/60 dark:text-muted-400"
          >
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </div>
        </a>
      </div>
    </nav>
  </div>
</template>
