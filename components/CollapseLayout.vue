<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    collapse?: boolean;
    toolbar?: boolean;
    circularMenu?: boolean;
    condensed?: boolean;
    horizontalScroll?: boolean;
  }>(),
  {
    collapse: true,
    toolbar: true,
    circularMenu: true,
  },
);

const app = useAppConfig();
const { isOpen, isMobileOpen, toggle } = useCollapse();

const collapseEnabled = computed(() => {
  return app.layout.collapse?.navigation?.enabled !== false && props.collapse !== false;
});
const toolbarEnabled = computed(() => {
  return app.layout.collapse?.toolbar?.enabled !== false && props.toolbar !== false;
});

const mainClass = computed(() => {
  if (props.condensed) {
    return 'bg-muted-50 dark:bg-muted-900 relative w-full';
  }

  if (!collapseEnabled.value) {
    return 'bg-muted-50 dark:bg-muted-900 relative w-full px-4 transition-all duration-300 xl:px-10';
  }

  const list = ['bg-muted-50 dark:bg-muted-900 relative w-full px-4 transition-all duration-300 xl:px-10'];

  if (isOpen.value) {
    list.push('lg:max-w-[calc(100%_-_280px)] lg:ms-[280px]');
  } else {
    list.push('lg:max-w-[calc(100%_-_80px)] lg:ms-[80px]');
  }

  if (props.horizontalScroll) {
    list.push('!pe-0 xl:!pe-0');
  }

  return list;
});
</script>

<template>
  <div class="h-screen overflow-y-auto bg-muted-50 pb-10 dark:bg-muted-900">
    <slot name="navigation">
      <CollapseNavigation v-if="collapseEnabled" />
      <div
        role="button"
        class="fixed start-0 top-0 z-[59] block h-full w-full bg-muted-800 transition-opacity duration-300 dark:bg-muted-900 lg:hidden"
        :class="isMobileOpen ? 'opacity-50 dark:opacity-75' : 'pointer-events-none opacity-0'"
        @click="toggle"
      ></div>
    </slot>

    <div :class="mainClass">
      <div
        :class="[
          props.condensed && !props.horizontalScroll && 'w-full',
          !props.condensed && props.horizontalScroll && 'mx-auto w-full',
          !props.condensed && !props.horizontalScroll && 'mx-auto w-full max-w-7xl',
        ]"
      >
        <slot name="toolbar">
          <CollapseToolbar v-if="toolbarEnabled" :collapse="props.collapse" :horizontal-scroll="props.horizontalScroll">
            <template #title><slot name="toolbar-title"></slot></template>
          </CollapseToolbar>
        </slot>

        <slot />
      </div>
    </div>

    <SidePanels />
  </div>
</template>
