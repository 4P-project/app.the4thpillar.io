<script setup lang="ts">
const { isOpen, isMobileOpen, menuItems } = useCollapse();
const app = useAppConfig();

const startMenuItems = computed(
  () => menuItems.value?.filter((sidebar) => !sidebar.position || sidebar.position === 'start'),
);
const endMenuItems = computed(() => menuItems.value?.filter((sidebar) => sidebar.position === 'end'));
</script>

<template>
  <div
    class="fixed start-0 top-0 z-[60] flex h-full flex-col border-r border-muted-200 bg-white transition-all duration-300 dark:border-muted-700 dark:bg-muted-800"
    :class="[
      !isOpen ? 'w-[80px]' : 'w-[280px]',
      isMobileOpen ? 'translate-x-0 lg:translate-x-0' : '-translate-x-full lg:translate-x-0',
    ]"
  >
    <!--Header-->
    <slot name="header">
      <component
        :is="resolveComponentOrNative(app.layout.collapse?.navigation?.header?.component)"
        v-if="app.layout.collapse?.navigation?.header?.component"
      />
    </slot>
    <!--Body-->
    <div
      class="nui-slimscroll relative flex w-full grow flex-col overflow-y-auto py-6"
      :class="!isOpen ? 'px-4' : 'px-6'"
    >
      <!--Menu-->
      <ul v-if="startMenuItems?.length" class="space-y-2">
        <!--Menu item-->
        <li v-for="(item, index) in startMenuItems" :key="index">
          <component
            :is="resolveComponentOrNative(item?.component?.name)"
            v-if="item?.component?.name"
            v-bind="item?.component?.props"
          />
          <CollapseNavigationCollapseLinks
            v-else-if="item.children"
            :item="item"
            :expanded="isOpen"
            @clicked="isOpen = true"
          />
          <NuxtLink
            v-else-if="item.to"
            :to="item.to"
            exact-active-class="!bg-primary-500/10 dark:!bg-primary-500/20 !text-primary-500 dark:!text-primary-500"
            class="nui-focus flex cursor-pointer items-center gap-4 rounded-lg py-3 text-muted-500 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:text-muted-400/80 dark:hover:bg-muted-700/60 dark:hover:text-muted-200"
            :class="!isOpen ? 'justify-center px-1' : 'px-4'"
          >
            <Icon :name="item.icon.name" :class="item.icon.class" />
            <span class="whitespace-nowrap font-sans text-sm" :class="!isOpen ? 'hidden' : 'block'">
              {{ item.name }}
            </span>
            <Icon v-if="item.isPro" name="ph:crown" class="ms-auto h-4 w-4 text-amber-500" />
          </NuxtLink>
          <div v-else-if="item.divider" class="my-3 h-px w-full border-t border-muted-200 dark:border-muted-700"></div>
          <button
            v-else
            class="nui-focus flex w-full cursor-pointer items-center gap-4 rounded-lg py-3 text-muted-500 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:text-muted-400/80 dark:hover:bg-muted-700/60 dark:hover:text-muted-200"
            :class="!isOpen ? 'justify-center px-1' : 'px-4'"
            @click="item.click"
          >
            <Icon :name="item.icon.name" :class="item.icon.class" />
            <span class="whitespace-nowrap font-sans text-sm" :class="!isOpen ? 'hidden' : 'block'">
              {{ item.name }}
            </span>
          </button>
        </li>
      </ul>
      <div class="mb-2 grow"></div>
      <!--Menu-->
      <ul v-if="endMenuItems?.length" class="space-y-2">
        <!--Menu item-->
        <li v-for="(item, index) in endMenuItems" :key="index">
          <component
            :is="resolveComponentOrNative(item?.component?.name)"
            v-if="item?.component?.name"
            v-bind="item?.component?.props"
          />
          <CollapseNavigationCollapseLinks
            v-else-if="item.children"
            :item="item"
            :expanded="isOpen"
            @clicked="isOpen = true"
          />
          <NuxtLink
            v-else-if="item.to"
            :to="item.to"
            exact-active-class="!bg-primary-500/10 dark:!bg-primary-500/20 !text-primary-500 dark:!text-primary-500"
            class="nui-focus flex cursor-pointer items-center gap-4 rounded-lg py-3 text-muted-500 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:text-muted-400/80 dark:hover:bg-muted-700/60 dark:hover:text-muted-200"
            :class="!isOpen ? 'justify-center px-1' : 'px-4'"
          >
            <Icon :name="item.icon.name" :class="item.icon.class" />
            <span class="whitespace-nowrap font-sans text-sm" :class="!isOpen ? 'hidden' : 'block'">
              {{ item.name }}
            </span>
          </NuxtLink>
          <div v-else-if="item.divider" class="my-3 h-px w-full border-t border-muted-200 dark:border-muted-700"></div>
          <button
            v-else
            class="nui-focus flex w-full cursor-pointer items-center gap-4 rounded-lg py-3 text-muted-500 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:text-muted-400/80 dark:hover:bg-muted-700/60 dark:hover:text-muted-200"
            :class="!isOpen ? 'justify-center px-1' : 'px-4'"
            @click="item.click"
          >
            <Icon :name="item.icon.name" :class="item.icon.class" />
            <span class="whitespace-nowrap font-sans text-sm" :class="!isOpen ? 'hidden' : 'block'">
              {{ item.name }}
            </span>
          </button>
        </li>
      </ul>
    </div>
    <!--Footer-->
    <slot name="footer">
      <component
        :is="resolveComponentOrNative(app.layout.collapse?.navigation?.footer?.component)"
        v-if="app.layout.collapse?.navigation?.footer?.component"
      />
    </slot>
  </div>
</template>
