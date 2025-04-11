import { createRouter, createWebHashHistory } from 'vue-router';
import i18n from '../i18n';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('../views/Search.vue'),
  },
  {
    path: '/planner',
    name: 'Planner',
    component: () => import('../views/Planner.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: { hideNav: true } 
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const queryLang = to.query.lang;
  const currentLang = i18n.global.locale.value;

  // 同步語言參數與i18n狀態
  if (queryLang) {
    if (queryLang === 'en' && currentLang !== 'en') {
      i18n.global.locale.value = 'en';
    } else if (queryLang === 'zh' && currentLang !== 'zh-TW') {
      i18n.global.locale.value = 'zh-TW';
    }
    return next();
  }

  // 無語言參數時，使用當前語言狀態設置參數
  next({
    ...to,
    query: { ...to.query, lang: currentLang === 'en' ? 'en' : 'zh' },
    replace: true,
  });
});

export default router;
