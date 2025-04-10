<script setup>
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="min-h-screen  back">
    <nav class="fixed top-0 left-0 w-full z-50 bg-white shadow-md bg-opacity-90 backdrop-blur-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex">
            <router-link
              to="/"
              class="flex items-center px-4 text-gray-900 hover:text-blue-500 transition-colors"
            >
              <span class="text-xl font-bold">TripPlanner</span>
            </router-link>

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
        </div>
      </div>
    </nav>

    <RouterView class="pt-20"/>
  </div>
</template>


