<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';

const router = useRouter();
const route = useRoute();
const { locale } = useI18n();

const switchLanguage = langKey => {
  const targetLang = langKey === 'en' ? 'en' : 'zh';
  router.push({
    path: route.path,
    query: { ...route.query, lang: targetLang },
    hash: route.hash,
  });
};
</script>

<template>
  <div class="flex gap-2 justify-end">
    <button
      @click="switchLanguage('en')"
      class="px-3 py-1 rounded transition-colors duration-200"
      :class="{ 
    'bg-blue-500 text-white hover:bg-blue-600': locale === 'en',
    'bg-gray-200 hover:bg-gray-300': locale !== 'en' 
        }"
    >
      English
    </button>
    <button
      @click="switchLanguage('zh')"
      class="px-3 py-1 rounded transition-colors duration-200"
  :class="{ 
    'bg-blue-500 text-white hover:bg-blue-600': locale === 'zh-TW',
    'bg-gray-200 hover:bg-gray-300': locale !== 'zh-TW' 
  }"
    >
      中文
    </button>
  </div>
</template>
