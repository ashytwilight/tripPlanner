<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p class="text-xl text-gray-600 mb-8">{{ $t('errors.pageNotFound') }}</p>
      <router-link
        to="/"
        class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        {{ $t('errors.backToHome') }}
      </router-link>
    </div>
  </div>
</template>
