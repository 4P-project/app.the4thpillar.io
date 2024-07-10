<script setup lang="ts">
definePageMeta({
  title: 'Dashboard',
});

const { isNftIntegrationEnabled } = usePollinationX();
</script>

<template>
  <div class="mb-7 grid grid-cols-12 gap-6">
    <div class="col-span-12 xl:order-1 xl:col-span-3">
      <!-- Upgrade to Pro widget -->
      <div class="relative">
        <ProWidget />
      </div>
    </div>
    <div class="col-span-12 xl:col-span-9">
      <div class="grid grid-cols-12 gap-6">
        <!-- Account widget -->
        <div class="col-span-12 md:col-span-7">
          <AccountDataWidget />
        </div>
        <!-- Encryptor widget -->
        <div class="col-span-12 md:col-span-5">
          <EncryptorWidget />
        </div>
        <!-- PollinationX widget -->
        <div v-if="isNftIntegrationEnabled" class="col-span-12 md:col-span-5">
          <PollinationxWidget />
        </div>
      </div>
    </div>
  </div>
</template>
