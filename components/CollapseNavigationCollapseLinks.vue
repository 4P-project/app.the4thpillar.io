<script setup lang="ts">
const props = defineProps<{
  item: any;
  expanded?: boolean;
}>();

const emit = defineEmits(['clicked']);

const route = useRoute();

const isActive = computed(() => {
  if (!props.item?.activePath) {
    return false;
  }

  return route.path.startsWith(props.item.activePath);
});

const buttonRef = ref<HTMLElement>();
const isOpen = ref(isActive.value);

function onDropClick() {
  isOpen.value = !isOpen.value;
  if (!isOpen.value) {
    buttonRef.value?.blur();
  }
  emit('clicked');
}
</script>

<template>
  <div class="group">
    <button
      ref="buttonRef"
      class="nui-focus flex w-full cursor-pointer items-center rounded-lg py-3 text-muted-500 transition-colors duration-300 hover:bg-muted-100 hover:text-muted-600 dark:text-muted-400/80 dark:hover:bg-muted-700/60 dark:hover:text-muted-200"
      :class="props.expanded ? 'gap-4 px-4' : 'justify-center px-2'"
      @click.stop.prevent="onDropClick"
    >
      <Icon :name="item.icon.name" :class="[item.icon.class, isActive && 'text-primary-500']" class="shrink-0" />
      <span
        class="block whitespace-nowrap font-sans text-sm"
        :class="[isActive && 'text-primary-500', !props.expanded ? 'hidden' : 'block']"
      >
        {{ item.name }}
      </span>
      <span class="ms-auto items-center justify-center" :class="!props.expanded ? 'hidden' : 'flex'">
        <Icon
          name="lucide:chevron-up"
          class="h-4 w-4 transition-transform duration-200"
          :class="!isOpen ? 'rotate-180' : ''"
        />
      </span>
    </button>

    <ul
      v-if="props.expanded"
      class="relative block border-muted-200 ps-4"
      :class="{
        'max-h-0 overflow-hidden opacity-0 group-focus-within:max-h-max group-focus-within:overflow-visible group-focus-within:opacity-100':
          !isOpen,
        'max-h-max opacity-100 after:border-muted-200': isOpen,
      }"
    >
      <li
        v-for="child in props.item.children"
        :key="child.to"
        class="ms-2 border-s-2 border-muted-300 first:mt-2 dark:border-muted-700"
      >
        <NuxtLink
          :to="child.to"
          exact-active-class="!border-primary-500 !text-primary-500 dark:!text-primary-500"
          class="nui-focus relative -start-0.5 flex cursor-pointer items-center gap-2 border-s-2 border-transparent py-2 ps-4 text-muted-500 transition-colors duration-300 hover:text-muted-600 dark:text-muted-400/80 dark:hover:text-muted-200"
        >
          <Icon :name="child.icon.name" :class="child.icon.class" class="shrink-0" />
          <span class="whitespace-nowrap font-sans text-[0.85rem]" :class="[!props.expanded ? 'hidden' : 'block']">
            {{ child.name }}
          </span>
          <Icon v-if="child.isPro" name="ph:crown" class="ms-auto h-4 w-4 text-amber-500" />
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
