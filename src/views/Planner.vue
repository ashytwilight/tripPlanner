<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import LocationMap from '../components/LocationMap.vue'

const { t } = useI18n()
const days = ref([])
const loading = ref(false)

// 從localStorage加載行程數據
const loadTripData = async () => {
  loading.value = true
  try {
    const savedTrip = localStorage.getItem('tripData')
    if (savedTrip) {
      const tripData = JSON.parse(savedTrip)
      if (Array.isArray(tripData) && tripData.length > 0) {
        days.value = tripData.map(day => ({
          ...day,
          attractions: day.attractions.map(attraction => ({
            ...attraction,
            location: attraction.location || {
              lat: attraction.lat || 23.5,
              lng: attraction.lng || 121
            }
          }))
        }))
        return
      }
    }

    // 如果兩個存儲都沒有數據，則初始化空的第一天
    days.value = [{ id: 1, attractions: [], notes: '' }]
  } catch (error) {
    console.error('加載行程數據時發生錯誤:', error)
    days.value = [{ id: 1, attractions: [], notes: '' }]
  } finally {
    loading.value = false
  }
}

// 初始化第一天
const initializeFirstDay = () => {
  const savedAttractions = localStorage.getItem('savedTrip')
  if (savedAttractions) {
    try {
      const attractions = JSON.parse(savedAttractions)
      if (Array.isArray(attractions) && attractions.length > 0) {
        days.value = [{
          id: 1,
          attractions: attractions.map(attraction => ({
            ...attraction,
            location: attraction.location || {
              lat: attraction.lat || 23.5,
              lng: attraction.lng || 121
            }
          })),
          notes: ''
        }]
      } else {
        days.value = [{ id: 1, attractions: [], notes: '' }]
      }
    } catch (error) {
      console.error('解析景點數據時發生錯誤:', error)
      days.value = [{ id: 1, attractions: [], notes: '' }]
    }
  } else {
    days.value = [{ id: 1, attractions: [], notes: '' }]
  }
}

// 監聽days變化，自動保存到localStorage
watch(days, (newDays) => {
  localStorage.setItem('tripData', JSON.stringify(newDays))
}, { deep: true })

onMounted(() => {
  loadTripData()
})

// 新增天數
const addDay = () => {
  const newDayId = Math.max(...days.value.map(day => day.id), 0) + 1
  days.value.push({
    id: newDayId,
    attractions: [],
    notes: ''
  })
}

// 刪除景點
// 刪除天數
const removeDay = (dayIndex) => {
  if (days.value.length <= 1) {
    alert('至少需要保留一天行程！')
    return
  }
  if (confirm('確定要刪除這一天的行程嗎？')) {
    days.value.splice(dayIndex, 1)
    // 重新排序天數ID
    days.value.forEach((day, index) => {
      day.id = index + 1
    })
  }
}

const removeAttraction = (dayIndex, attractionIndex) => {
  if (dayIndex >= 0 && dayIndex < days.value.length) {
    const day = days.value[dayIndex]
    if (attractionIndex >= 0 && attractionIndex < day.attractions.length) {
      day.attractions.splice(attractionIndex, 1)
    }
  }
}

// 移動景點到其他天數
const moveAttraction = (fromDay, toDay, attraction) => {
  if (fromDay === toDay || toDay === '') return
  
  const fromDayIndex = parseInt(fromDay)
  const toDayIndex = parseInt(toDay)
  
  if (fromDayIndex >= 0 && fromDayIndex < days.value.length &&
      toDayIndex >= 0 && toDayIndex < days.value.length) {
    const fromDayAttractions = days.value[fromDayIndex].attractions
    const attractionIndex = fromDayAttractions.findIndex(a => a.id === attraction.id)
    
    if (attractionIndex !== -1) {
      const [movedAttraction] = fromDayAttractions.splice(attractionIndex, 1)
      days.value[toDayIndex].attractions.push(movedAttraction)
    }
  }
}

// 計算地圖中心點
const getCenterLocation = (attractions) => {
  if (!attractions || attractions.length === 0) {
    return { lat: 23.5, lng: 121 } // 台灣中心點
  }
  
  const validAttractions = attractions.filter(attr => 
    attr.location && typeof attr.location.lat === 'number' && typeof attr.location.lng === 'number'
  )
  
  if (validAttractions.length === 0) {
    return { lat: 23.5, lng: 121 }
  }
  
  const totalLat = validAttractions.reduce((sum, attr) => sum + attr.location.lat, 0)
  const totalLng = validAttractions.reduce((sum, attr) => sum + attr.location.lng, 0)
  
  return {
    lat: totalLat / validAttractions.length,
    lng: totalLng / validAttractions.length
  }
}


</script>

<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-4xl font-bold text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          {{ t('planner.title') }}
        </h1>
        <div class="space-x-4">
          <button
            @click="addDay"
            class="bg-gradient-to-r from-green-400 to-green-600 text-white px-6 py-2.5 rounded-lg font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            {{ t('planner.addDay') }}
          </button>

        </div>
      </div>

      <div v-if="loading" class="text-center py-12">
        <div class="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto"></div>
      </div>

      <div v-else-if="days.length === 0" class="text-center py-16 bg-white rounded-2xl shadow-md">
        <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
        </svg>
        <p class="text-xl text-gray-500 font-medium">{{ t('planner.empty') }}</p>
      </div>

      <div v-else class="space-y-8">
        <div
          v-for="(day, dayIndex) in days"
          :key="day.id"
          class="bg-white rounded-2xl shadow-lg p-8 transform transition-all duration-200 hover:shadow-xl"
        >
          <h2 class="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span class="bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm">{{ day.id }}</span>
            {{ t('planner.day', { n: day.id }) }}
            <button
              @click="removeDay(dayIndex)"
              class="ml-auto flex items-center px-3 py-1 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              刪除
            </button>
          </h2>
          
          <div class="space-y-4">
            <div class="flex justify-end mb-4">
    <router-link 
      :to="{ path: '/search', query: { day: day.id } }"
      class="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
    >
      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
      </svg>
      新增景點
    </router-link>
  </div>
            <div
              v-for="(attraction, attractionIndex) in day.attractions"
              :key="attraction.id"
              class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-xl transition-all duration-200 hover:shadow-md"
            >
              <div>
                <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ attraction.name }}</h3>
                <p class="text-sm text-gray-600">{{ attraction.city }}</p>
              </div>
              <!-- {{attraction}} -->
              <div class="mt-4 mb-4">
                <LocationMap
                  :latitude="attraction.location.lat"
                  :longitude="attraction.location.lng"
                  height="200px"
                  :zoom="16"
                />
              </div>
              
              <div class="flex items-center space-x-4 mt-4">
                <select
                  v-if="days.length > 1"
                  class="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  @change="moveAttraction(dayIndex, $event.target.value, attraction)"
                >
                  <option value="">移動到...</option>
                  <option
                    v-for="(otherDay, index) in days"
                    :key="otherDay.id"
                    :value="index"
                    :disabled="index === dayIndex"
                  >
                    第 {{ otherDay.id }} 天
                  </option>
                </select>
                
                <button
                  @click="removeAttraction(dayIndex, attractionIndex)"
                  class="flex items-center px-4 py-2 text-red-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                  <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  刪除
                </button>
              </div>
            </div>

            <div class="mt-6 bg-white rounded-xl p-6 shadow-sm">
              <label class="block text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
                {{ t('planner.notes') }}
              </label>
              <textarea
                v-model="day.notes"
                rows="4"
                class="w-full border-2 border-gray-200 rounded-lg p-4 text-gray-700 focus:outline-none focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50  transition-all duration-200 resize-none"
                :placeholder="'在這裡添加第' + day.id + '天的行程備註...'"
              ></textarea>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>