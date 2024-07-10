<script setup lang="ts">
const props = defineProps<{
  title?: string;
  description?: string;
  transparent?: boolean;
}>();
</script>

<template>
  <div class="px-8 py-12 text-center" :class="!props.transparent && 'bg-muted-200 dark:bg-muted-800'">
    <div class="mx-auto w-full max-w-lg">
      <h3 class="mb-2 font-heading text-lg text-muted-800 dark:text-white">
        {{ props.title }}
      </h3>
      <p class="font-sans text-muted-500">
        {{ props.description }}
      </p>
    </div>
    <slot />
  </div>
</template>
