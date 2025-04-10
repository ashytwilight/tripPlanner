<script setup>
import { useI18n } from 'vue-i18n'
import { ref } from 'vue'

const { t, locale } = useI18n()
const availableLocales = ref(['zh-TW', 'en'])

const toggleLocale = () => {
  locale.value = locale.value === 'zh-TW' ? 'en' : 'zh-TW'
}
</script>

<template>
  <div>
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="text-right mb-4">
        <button
          @click="toggleLocale"
          class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          {{ locale === 'zh-TW' ? 'English' : '中文' }}
        </button>
      </div>

      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-900 mb-8">{{ t('nav.home') }}</h1>
        <p class="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          探索世界各地的精彩景點，規劃專屬於你的完美旅程。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ t('nav.search') }}</h2>
          <p class="text-gray-600 mb-4">
            搜尋全球各地景點，獲取詳細資訊和評價。
          </p>
          <router-link
            to="/search"
            class="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            立即搜尋
          </router-link>
        </div>

        <div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">{{ t('nav.planner') }}</h2>
          <p class="text-gray-600 mb-4">
            規劃你的行程，添加景點和備註，打造完美旅遊計畫。
          </p>
          <router-link
            to="/planner"
            class="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            開始規劃
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>