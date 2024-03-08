<script setup lang="ts">
defineProps<{
  isLoading: boolean;
}>();
</script>

<template>
  <div
    class="pointer-events-none absolute inset-0 z-10 h-full w-full bg-muted-100 p-8 transition-opacity duration-300 dark:bg-muted-900"
    :class="isLoading ? 'opacity-100' : 'pointer-events-none opacity-0'"
  >
    <div class="mt-12 space-y-12">
      <div class="flex w-full max-w-md gap-4">
        <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
        <div class="grow space-y-2">
          <BasePlaceload class="h-3 w-full max-w-[14rem] rounded" />
          <BasePlaceload class="h-3 w-full max-w-[8rem] rounded" />
        </div>
      </div>
      <div class="flex w-full max-w-md gap-4">
        <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
        <div class="grow space-y-2">
          <BasePlaceload class="h-3 w-full max-w-[16rem] rounded" />
          <BasePlaceload class="h-3 w-full max-w-[12rem] rounded" />
        </div>
      </div>
      <div class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4">
        <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
        <div class="grow space-y-2">
          <BasePlaceload class="ms-auto h-3 w-full max-w-[16rem] rounded" />
          <BasePlaceload class="ms-auto h-3 w-full max-w-[12rem] rounded" />
        </div>
      </div>
      <div class="ms-auto flex w-full max-w-md flex-row-reverse justify-end gap-4">
        <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
        <div class="grow space-y-2">
          <BasePlaceload class="ms-auto h-3 w-full max-w-[14rem] rounded" />
          <BasePlaceload class="ms-auto h-3 w-full max-w-[8rem] rounded" />
        </div>
      </div>
      <div class="flex w-full max-w-md gap-4">
        <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
        <div class="grow space-y-2">
          <BasePlaceload class="h-3 w-full max-w-[14rem] rounded" />
          <BasePlaceload class="h-3 w-full max-w-[8rem] rounded" />
        </div>
      </div>
      <div class="flex w-full max-w-md gap-4">
        <BasePlaceload class="h-8 w-8 shrink-0 rounded-full" :width="32" :height="32" />
        <div class="grow space-y-2">
          <BasePlaceload class="h-3 w-full max-w-[16rem] rounded" />
          <BasePlaceload class="h-3 w-full max-w-[12rem] rounded" />
        </div>
      </div>
    </div>
  </div>
</template>
