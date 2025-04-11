import { createI18n } from 'vue-i18n';

const messages = {
  'zh-TW': {
    nav: {
      home: '首頁',
      search: '景點搜尋',
      planner: '行程規劃',
    },
    home: {
      searchButton: '立即搜尋',
      planButton: '開始規劃',
      homeDescritpion: '探索世界各地的精彩景點，規劃專屬於你的完美旅程。',
      searchDescription: '搜尋全球各地景點，獲取詳細資訊和評價。',
      plannerDescription: '規劃你的行程，添加景點和備註，打造完美旅遊計畫。',
    },
    search: {
      title: '搜尋景點',
      placeholder: '輸入城市或景點名稱',
      searchButton: '搜尋',
      noResults: '沒有找到相關景點',
      addToTrip: '加入行程',
      listMode: '列表模式',
      mapMode: '地圖模式',
      regionSelect: '選擇地區',
      daySelect: '第{n}天',
      locatedAt: '位於',
    },
    planner: {
      title: '我的行程',
      addDay: '新增天數',
      day: '第 {n} 天',
      notes: '備註',
      save: '儲存行程',
      empty: '尚未加入任何景點',
      switch: '移動到...',
      delete: '刪除',
      addAttraction: '新增景點',
      textareaPlaceholder: '在這裡添加第{n}天的行程備註...',
    },
    map: {
      locationError: '無法獲取位置',
      rating: '評分',
    },
    errors: {
      invalidParams: '搜尋參數無效，請修改搜尋條件',
      unauthorized: 'API授權失敗，請聯繫管理員',
      tooManyRequests: '請求次數過多，請稍後再試',
      serverError: '服務器錯誤，請稍後再試',
      serverErrorWithCode: '服務器返回錯誤 ({code})',
      networkError: '網絡連接失敗，請檢查網絡設置',
      searchError: '搜尋景點時發生錯誤，請稍後再試',
      pageNotFound: '頁面不存在',
      backToHome: '返回首頁',
    },
    region: {
      TW: '台灣',
      JP: '日本',
      US: '美國',
      FR: '法國',
      UK: '英國',
      KR: '韓國',
      SG: '新加坡',
      TH: '泰國',
    },
  },
  en: {
    nav: {
      home: 'Home',
      search: 'Search Attractions',
      planner: 'Trip Planner',
    },
    home: {
      searchButton: 'Search Now',
      planButton: 'Start Planning',
      homeDescritpion:
        "Explore the world's most captivating destinations and plan a journey that's uniquely yours.",
      searchDescription:
        'Discover attractions around the world with in-depth details and authentic reviews.',
      plannerDescription:
        'Plan your trip, add attractions and notes to create the perfect travel plan.',
    },
    search: {
      title: 'Search Attractions',
      placeholder: 'Enter city or attraction name',
      searchButton: 'Search',
      noResults: 'No attractions found',
      addToTrip: 'Add to Trip',
      listMode: 'List Mode',
      mapMode: 'Map Mode',
      regionSelect: 'Select Region',
      daySelect: 'Day {n}',
      locatedAt: 'Located at',
    },
    planner: {
      title: 'My Trip',
      addDay: 'Add Day',
      day: 'Day {n}',
      notes: 'Notes',
      save: 'Save Trip',
      empty: 'No attractions added yet',
      switch: 'Switch To...',
      delete: 'Delete',
      addAttraction: 'Add Attraction',
      textareaPlaceholder: 'Add notes for day {n}...',
    },
    map: {
      locationError: 'Unable to get location',
      rating: 'Rating',
    },
    errors: {
      invalidParams:
        'Invalid search parameters, please modify your search criteria',
      unauthorized: 'API authorization failed, please contact administrator',
      tooManyRequests: 'Too many requests, please try again later',
      serverError: 'Server error, please try again later',
      serverErrorWithCode: 'Server returned error ({code})',
      networkError:
        'Network connection failed, please check your network settings',
      searchError:
        'Error occurred while searching attractions, please try again later',
      pageNotFound: 'Page Not Found',
      backToHome: 'Back to Home',
    },
    region: {
      TW: 'Taiwan',
      JP: 'Japan',
      US: 'United States',
      FR: 'France',
      UK: 'United Kingdom',
      KR: 'South Korea',
      SG: 'Singapore',
      TH: 'Thailand',
    },
  },
};

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages,
});

export default i18n;
