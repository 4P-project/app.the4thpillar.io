<template>
  <div
    class="relative z-10 hidden h-screen w-20 border-r border-muted-200 bg-white dark:border-muted-700 dark:bg-muted-800 sm:block"
  >
    <div class="flex h-full flex-col justify-between">
      <div class="flex flex-col">
        <div class="flex h-16 w-16 shrink-0 items-center justify-center lg:w-full ltablet:w-full">
          <NuxtLink to="/" class="flex items-center justify-center">
            <LogoIcon class="h-10 text-primary-600" />
          </NuxtLink>
        </div>
        <div class="flex h-16 w-16 shrink-0 items-center justify-center lg:w-full ltablet:w-full">
          <a
            href="#"
            class="flex h-12 w-12 items-center justify-center rounded-2xl text-muted-400 transition-colors duration-300 hover:bg-primary-500/20 hover:text-primary-500"
            title="Back"
            @click.prevent="$router.back()"
          >
            <Icon name="lucide:arrow-left" class="h-5 w-5" />
          </a>
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex h-16 w-full items-center justify-center">
          <AccountMenu />
        </div>
      </div>
    </div>
  </div>
</template>
