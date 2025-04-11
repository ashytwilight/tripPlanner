<script setup>
import { RouterView,useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { ref } from 'vue';

const { t } = useI18n();
const isMobileMenuOpen = ref(false);
const route = useRoute()
</script>

<template>
  <div class="min-h-screen back">
    <nav
    v-if="!route.meta.hideNav"
      class="fixed top-0 left-0 w-full z-[9999] bg-white shadow-md bg-opacity-90 backdrop-blur-sm"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <!-- 左側區域：品牌 + 桌面導航 -->
          <div class="flex items-center space-x-8">
            <router-link
              to="/"
              class="flex items-center px-4 text-gray-900 hover:text-blue-500 transition-colors"
            >
              <span class="text-xl font-bold">TripPlanner</span>
            </router-link>

            <!-- 桌面導航移動到左側 -->
            <div class="hidden sm:flex sm:space-x-8">
              <router-link
                to="/search"
                class="flex items-center px-3 text-gray-900 hover:text-blue-500 transition-colors"
              >
                {{ t('nav.search') }}
              </router-link>
              <router-link
                to="/planner"
                class="flex items-center px-3 text-gray-900 hover:text-blue-500 transition-colors"
              >
                {{ t('nav.planner') }}
              </router-link>
            </div>
          </div>

          <!-- 右側區域：語言切換 + 漢堡菜單 -->
          <div class="flex items-center space-x-4">
            <!-- <LanguageSwitcher class="hidden sm:block" /> -->
            <div class="sm:hidden flex items-center">
              <button
                @click="isMobileMenuOpen = !isMobileMenuOpen"
                class="p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none"
              >
                <svg
                  class="h-6 w-6"
                  :class="{
                    hidden: isMobileMenuOpen,
                    block: !isMobileMenuOpen,
                  }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
                <svg
                  class="h-6 w-6"
                  :class="{
                    hidden: !isMobileMenuOpen,
                    block: isMobileMenuOpen,
                  }"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 手機下拉 -->
      <transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="transform opacity-0 scale-95"
        enter-to-class="transform opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="transform opacity-100 scale-100"
        leave-to-class="transform opacity-0 scale-95"
      >
        <div v-show="isMobileMenuOpen" class="sm:hidden bg-white border-t">
          <div class="px-2 pt-2 pb-3 space-y-1">
            <router-link
              to="/search"
              @click="isMobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              {{ t('nav.search') }}
            </router-link>
            <router-link
              to="/planner"
              @click="isMobileMenuOpen = false"
              class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100"
            >
              {{ t('nav.planner') }}
            </router-link>
          </div>
        </div>
      </transition>
    </nav>

    <RouterView :class="!route.meta.hideNav?'pt-20':''" />
  </div>
</template>
