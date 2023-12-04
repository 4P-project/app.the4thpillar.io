<script setup lang="ts">
import { Buffer } from 'buffer/';
window.Buffer = Buffer;

const route = useRoute();
const app = useAppConfig();

useHead({
  title: () => route.meta?.title ?? '',
  titleTemplate: (titleChunk) =>
    titleChunk
      ? `${titleChunk} - ${app.meta.title}`
      : `${app.meta.title}${app.meta.titleSuffix ? ` | ${app.meta.titleSuffix}` : ''}`,
  htmlAttrs: {
    lang: 'en',
    dir: 'ltr',
  },
  link: [
    {
      rel: 'icon',
      type: 'image/png',
      href: '/img/favicon.png',
    },
  ],
  meta: [
    {
      name: 'description',
      content: () => route.meta.description ?? app.meta.description,
    },
    {
      name: 'twitter:card',
      content: 'summary_large_image',
    },
    ...(app.meta.twitter?.site ? [{ name: 'twitter:site', content: app.meta.twitter.site }] : []),
    {
      name: 'og:image:type',
      content: 'image/png',
    },
    {
      name: 'og:image:width',
      content: '1200',
    },
    {
      name: 'og:image:height',
      content: '630',
    },
    {
      name: 'og:image',
      content: '/img/preview.png',
    },
  ],
});
</script>

<template>
  <div>
    <NetworkSwitcher />

    <NuxtLayout>
      <NuxtLoadingIndicator color="rgb(var(--color-primary-500))" />
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
