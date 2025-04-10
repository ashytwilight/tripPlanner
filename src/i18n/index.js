import { createI18n } from 'vue-i18n'

const messages = {
  'zh-TW': {
    nav: {
      home: '首頁',
      search: '景點搜尋',
      planner: '行程規劃'
    },
    search: {
      title: '搜尋景點',
      placeholder: '輸入城市或景點名稱',
      searchButton: '搜尋',
      noResults: '沒有找到相關景點',
      addToTrip: '加入行程'
    },
    planner: {
      title: '我的行程',
      addDay: '新增天數',
      day: '第 {n} 天',
      notes: '備註',
      save: '儲存行程',
      empty: '尚未加入任何景點'
    }
  },
  'en': {
    nav: {
      home: 'Home',
      search: 'Search Attractions',
      planner: 'Trip Planner'
    },
    search: {
      title: 'Search Attractions',
      placeholder: 'Enter city or attraction name',
      searchButton: 'Search',
      noResults: 'No attractions found',
      addToTrip: 'Add to Trip'
    },
    planner: {
      title: 'My Trip',
      addDay: 'Add Day',
      day: 'Day {n}',
      notes: 'Notes',
      save: 'Save Trip',
      empty: 'No attractions added yet'
    }
  }
}

const i18n = createI18n({
  legacy: false,
  locale: 'zh-TW',
  fallbackLocale: 'en',
  messages
})

export default i18n