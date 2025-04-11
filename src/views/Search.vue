<template>
  <div class="py-12 px-4 sm:px-6 lg:px-8">
    <div class="w-full mx-auto">
      <h1 class="text-3xl font-bold text-center text-gray-900 mb-8">
        {{ t('search.title') }}
      </h1>
      <!-- {{mapBounds  }} -->
      <div class="flex flex-col md:flex-row gap-4 mb-8">
        <div class="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <div class="flex gap-2 w-full sm:w-auto">
            <button
              @click="[(isMapMode = false), (attractions = []), (error = null)]"
              class="px-4 py-2 rounded flex-1 sm:flex-none transition-colors duration-200"
  :class="!isMapMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'"
            >
              {{ t('search.listMode') }}
              <!-- 列表模式 -->
            </button>
            <button
              @click="
                () => {
                  isMapMode = !isMapMode;
                  attractions = [];
                  error = null;
                  if (isMapMode && mapBounds) {
                    handleSearch();
                  }
                }
              "
              class="px-4 py-2 rounded flex-1 sm:flex-none transition-colors duration-200"
              :class="isMapMode ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-200 hover:bg-gray-300'"
            >
              {{ t('search.mapMode') }}
              <!-- 地圖模式 -->
            </button>
          </div>
          <select
            v-model="selectedRegion"
            class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none w-full sm:w-auto"
          >
            <!-- <option v-for="(name, code) in regions" :key="code" :value="code">
              {{ name }}
            </option> -->
            <option v-for="code in regionCodes" :key="code" :value="code">
              {{ t(`region.${code}`) }}
            </option>
          </select>
        </div>
        <div class="flex-1">
          <input
            v-if="!isMapMode"
            v-model="searchQuery"
            type="text"
            :placeholder="t('search.placeholder')"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            @keyup.enter="handleSearch"
          />
        </div>
        <div
          v-if="isMapMode"
          class="flex gap-2 overflow-x-auto w-full md:w-auto"
        >
          <button
            v-for="cat in [
              'attractions',
              'food',
              'cafe',
              'hotel',
              'park',
              'shopping',
            ]"
            :key="cat"
            @click="
              () => {
                selectedCategory = cat;
                if (mapBounds) handleSearch();
              }
            "
            class="px-4 py-2 whitespace-nowrap rounded flex-shrink-0"
            :class="
              selectedCategory === cat
                ? 'bg-green-500 text-white'
                : 'bg-gray-200'
            "
          >
            {{
              {
                attractions: '景點',
                food: '美食',
                cafe: '咖啡廳',
                hotel: '住宿',
                park: '公園',
                shopping: '購物',
              }[cat]
            }}
          </button>
        </div>
        <button
          v-if="!isMapMode"
          @click="handleSearch"
          class="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full md:w-auto"
          :disabled="loading"
        >
          {{ t('search.searchButton') }}
        </button>
      </div>
      <!-- <p class="text-sm text-gray-600 text-center">
          目前搜尋範圍：{{ regions[selectedRegion] }}
        </p> -->

      <div v-if="error" class="text-red-500 text-center mb-4">
        {{ error }}
      </div>
      <div v-if="isMapMode" class="relative mb-6 flex flex-col md:flex-row">
        <!-- 地圖區域 -->
        <div class="flex-1 relative">
          <div
            v-if="mapLoading"
            class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[500]"
          >
            <div
              class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
            ></div>
          </div>
          <LocationMap
            ref="locationMap"
            :latitude="23.5"
            :longitude="121"
            :zoom="15"
            height="600px"
            :search-mode="true"
            :markers="attractions"
            :trip-days="tripDays"
            :selected-day="selectedDay"
            :use-geolocation="true"
            :selected-region="selectedRegion"
            @map-ready="handleMapReady"
            @update:bounds="
              bounds => {
                mapBounds = bounds;
                debouncedSearch();
              }
            "
            @add-to-trip="addToTrip($event)"
            @update:selected-day="selectedDay = $event"
          />
        </div>
      </div>

      <div v-if="loading" class="text-center py-8">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"
        ></div>
      </div>

      <div v-else-if="!isMapMode" class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          v-for="attraction in attractions"
          :key="attraction.id"
          @click="handleAttractionClick(attraction)"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <div class="p-4">
            <h3 class="text-xl font-semibold text-gray-900 mb-2">
              {{ attraction.name }}
            </h3>
            <p class="text-gray-600 mb-4">
              {{ attraction.description }}
            </p>
            <div class="mt-4 mb-4">
              <!-- {{ attraction }} -->
              <LocationMap
                :latitude="attraction.location.lat"
                :longitude="attraction.location.lng"
                height="200px"
                :zoom="15"
                :selected-region="selectedRegion"
              />
            </div>
            <div class="flex justify-end">
              <!-- <span class="text-sm text-gray-500">{{ attraction.city }}</span> -->
              <div class="flex items-center gap-2">
                <select
                  v-model="selectedDay"
                  class="px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent h-full"
                >
                  <option v-for="day in tripDays" :key="day.id" :value="day.id">
                    {{ t('search.daySelect', { n: day.id }) }}
                    <!-- 第 {{ day.id }} 天 -->
                  </option>
                </select>
                <button
                  @click="addToTrip(attraction)"
                  class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
                >
                  {{ t('search.addToTrip') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { debounce } from 'lodash';
import { searchAttractions } from '../services/api';
import LocationMap from '../components/LocationMap.vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { t } = useI18n();

const isMapMode = ref(false);
const selectedCategory = ref('attractions');
const mapBounds = ref(null);
const searchQuery = ref('');
const selectedRegion = ref('TW');
const attractions = ref([]);
const loading = ref(false);
const mapLoading = ref(false);
const error = ref(null);
const selectedDay = ref(1);
const tripDays = ref([]);

const regionCodes = ['TW', 'JP', 'US', 'FR', 'UK', 'KR', 'SG', 'TH'];

const handleMapReady = bounds => {
  mapBounds.value = bounds;
  handleSearch();
};

const handleSearch = async () => {
  console.log('enter');
  if (!isMapMode.value && !searchQuery.value.trim()) return;
  if (isMapMode.value && !mapBounds.value) return;
  if (isMapMode.value) mapLoading.value = true;
  else loading.value = true;
  error.value = null;
  attractions.value = []; // 清空當前結果

  try {
    const searchOptions = isMapMode.value
      ? {
          bounds: mapBounds.value,
          category: selectedCategory.value,
        }
      : {};
    attractions.value = await searchAttractions(
      searchQuery.value,
      selectedRegion.value,
      searchOptions
    );
    error.value = null;
  } catch (err) {
    error.value = err.message || '搜尋時發生錯誤，請稍後再試';
    attractions.value = [];
  } finally {
    mapLoading.value = false;
    loading.value = false;
  }
};

const debouncedSearch = debounce(() => {
  handleSearch();
}, 1500);

// 從localStorage讀取行程天數
const loadTripDays = () => {
  const tripData = localStorage.getItem('tripData');
  if (tripData) {
    const days = JSON.parse(tripData);
    tripDays.value = days;
    // 預設選擇最後一天
    // selectedDay.value = days[days.length - 1].id

    // 優先使用URL參數中的day值
    const urlDay = parseInt(route.query.day);
    if (!isNaN(urlDay) && days.some(day => day.id === urlDay)) {
      selectedDay.value = urlDay;
    } else {
      // 預設選擇最後一天
      selectedDay.value = days[days.length - 1].id;
    }
  } else {
    // 如果沒有行程數據，初始化第一天
    tripDays.value = [{ id: 1, attractions: [], notes: '' }];
    selectedDay.value = 1;
  }
};

// 在組件掛載時載入行程天數
onMounted(() => {
  if (!isMapMode.value) {
    handleSearch(); // 添加初始化搜索
  }
  loadTripDays();
});

const addToTrip = attraction => {
  // 檢查選擇的天數是否存在
  const dayIndex = tripDays.value.findIndex(
    day => day.id === selectedDay.value
  );
  if (dayIndex === -1) {
    alert('請選擇有效的行程天數');
    return;
  }

  // 檢查景點是否已存在於任何一天的行程中
  const isAttractionExists = tripDays.value.some(day =>
    day.attractions.some(item => item.id === attraction.id)
  );

  if (!isAttractionExists) {
    // 將景點加入到選擇的那一天
    tripDays.value[dayIndex].attractions.push(attraction);
    // 更新localStorage
    localStorage.setItem('tripData', JSON.stringify(tripDays.value));
    alert(`已加入第 ${selectedDay.value} 天行程！`);
  } else {
    alert('此景點已在行程中');
  }
};
const locationMap = ref(null);

const handleAttractionClick = attraction => {
  console.log('handleattractionclick');
  if (locationMap.value) {
    locationMap.value.panTo(attraction.location.lat, attraction.location.lng);
    locationMap.value.openMarkerPopup(attraction.id);
  }
};

// 添加全局方法用於地圖標記點的加入行程功能
window.addToTrip = attractionId => {
  const attraction = attractions.value.find(a => a.id === attractionId);
  if (attraction) {
    const daySelect = document.getElementById(`daySelect_${attractionId}`);
    const selectedDayId = parseInt(daySelect.value);
    const dayIndex = tripDays.value.findIndex(day => day.id === selectedDayId);

    if (dayIndex === -1) {
      alert('請選擇有效的行程天數');
      return;
    }

    const isAttractionExists = tripDays.value.some(day =>
      day.attractions.some(item => item.id === attraction.id)
    );

    if (!isAttractionExists) {
      tripDays.value[dayIndex].attractions.push(attraction);
      localStorage.setItem('tripData', JSON.stringify(tripDays.value));
      alert(`已加入第 ${selectedDayId} 天行程！`);
    } else {
      alert('此景點已在行程中');
    }
  }
};
</script>
