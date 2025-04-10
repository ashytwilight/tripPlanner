<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  height: {
    type: String,
    default: '300px'
  },
  zoom: {
    type: Number,
    default: 15  // 調整預設縮放級別為15，以更清楚地顯示周邊環境
  },
  markers: {
    type: Array,
    default: () => []
  },
  searchMode: {
    type: Boolean,
    default: false
  },
  tripDays: {
    type: Array,
    default: () => []
  },
  selectedDay: {
    type: Number,
    default: 1
  },
  useGeolocation: {  // 添加新的prop來控制是否使用地理位置
    type: Boolean,
    default: false
  },
  selectedRegion: {
    type: String,
    default: 'TW'
  }
})

const emit = defineEmits(['update:bounds', 'add-to-trip', 'update:selectedDay','map-ready'])

const mapContainer = ref(null)
let map = null
let marker = null
let markerLayer = null
const markerRefs = ref(new Map())
const isPopupFromList = ref(false)

//搜尋地圖模式地圖
const initMap = () => {
  if (map) return
  console.log('init',isPopupFromList.value,props.useGeolocation)
  if (props.useGeolocation) {
    // 嘗試獲取用戶位置
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        map = L.map(mapContainer.value).setView([latitude, longitude], props.zoom)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)
        
        // 在地圖初始化完成後發出map-ready事件
        const bounds = map.getBounds()
        emit('map-ready', {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        })
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map)

        if (!props.searchMode) {
          marker = L.marker([latitude, longitude]).addTo(map)
        }

        markerLayer = L.layerGroup().addTo(map)

        if (props.searchMode) {
          map.on('moveend', () => {
            if (!isPopupFromList.value) {
              const bounds = map.getBounds()
              emit('update:bounds', {
                north: bounds.getNorth(),
                south: bounds.getSouth(),
                east: bounds.getEast(),
                west: bounds.getWest()
              })
            }
            isPopupFromList.value = false
          })
        }

        // 在地圖載入完成後觸發map-ready事件
        map.on('load', () => {
          const bounds = map.getBounds()
          emit('map-ready', {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest()
          })
        })
      },
      (error) => {
        console.error('無法獲取位置：', error)
        // 如果獲取位置失敗，使用預設位置
        initMapWithDefaultLocation()
      }
    )
  } else {
    initMapWithDefaultLocation()
  }
}

import { regionCenters } from '../services/nominatim'

//行程規劃地圖
const initMapWithDefaultLocation = () => {
  console.log('initMapWithDefaultLocation',isPopupFromList.value,props.latitude, props.longitude,props.zoom)
  // 仅在搜索模式使用地区中心坐标
  const baseCoords = props.searchMode 
    ? (regionCenters[props.selectedRegion] || regionCenters['TW'])
    : { lat: props.latitude, lon: props.longitude }
  map = L.map(mapContainer.value).setView(
    [baseCoords.lat, baseCoords.lon], 
    props.zoom
  )
  // map = L.map(mapContainer.value).setView([region.lat, region.lon], props.zoom)
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map)

  if (!props.searchMode) {
    marker = L.marker([props.latitude, props.longitude]).addTo(map)
  }

  markerLayer = L.layerGroup().addTo(map)

  if (props.searchMode) {
    map.on('moveend', () => {
      if (!isPopupFromList.value) {
        const bounds = map.getBounds()
        emit('update:bounds', {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        })
      }
      isPopupFromList.value = false
    })
  }

  // 在地圖載入完成後觸發map-ready事件
  map.on('load', () => {
    const bounds = map.getBounds()
    emit('map-ready', {
      north: bounds.getNorth(),
      south: bounds.getSouth(),
      east: bounds.getEast(),
      west: bounds.getWest()
    })
  })
}

const updateMarker = () => {
  if (!map || (!marker && !props.searchMode)) return
  const newLatLng = [props.latitude, props.longitude]
  if (marker) {
    marker.setLatLng(newLatLng)
    map.setView(newLatLng)
  }
}

const panTo = (lat, lng) => {
  if (!map) return
  map.setView([lat, lng], props.zoom)
}

const openMarkerPopup = (markerId) => {
  console.log('openmarkerpopup')
  const marker = markerRefs.value.get(markerId)
  if (marker) {
    isPopupFromList.value = true
    marker.openPopup()
    // 將地圖視圖移動到標記位置
    // const latLng = marker.getLatLng()
    // map.setView(latLng, props.zoom)
  }
}

const updateMarkers = () => {
  if (!map || !markerLayer) return
  
  markerLayer.clearLayers()
  markerRefs.value.clear()
  
  props.markers.forEach(markerData => {
    const marker = L.marker([markerData.location.lat, markerData.location.lng])
    // 添加標記點擊事件處理
    marker.on('click', () => {
      isPopupFromList.value = true
      console.log('2222',isPopupFromList.value)
    })
    marker.bindPopup(`
      <div class="p-2">
        <h3 class="font-bold">${markerData.name}</h3>
        <p class="text-sm">${markerData.description || ''}</p>
        ${markerData.rating ? `<p class="text-sm">評分: ${markerData.rating}</p>` : ''}
        <div class="mt-2">
          <select id="daySelect_${markerData.id}" class="mb-2 px-2 py-1 border rounded">
            ${props.tripDays.map(day => `<option value="${day.id}" ${day.id === props.selectedDay ? 'selected' : ''}>第 ${day.id} 天</option>`).join('')}
          </select>
          <button onclick="window.addToTrip('${markerData.id}')" class="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600">加入行程</button>
        </div>
      </div>
    `, {
      autoPan: true,
      keepInView: true,
      autoPanPadding: [50, 50]
    })

    // 添加懸浮提示
    marker.bindTooltip(`
      <div class="leaflet-tooltip-content">
        <div class="font-semibold">${markerData.name}</div>
        ${markerData.description ? `<div class="text-sm">${markerData.description}</div>` : ''}
      </div>
    `, {
      direction: 'top',       // 提示顯示在標記上方
      permanent: false,       // 僅在hover時顯示
      className: 'custom-tooltip', // 添加自定義樣式類
      offset: L.point(0, -10) // 向上偏移10像素
    })
    markerLayer.addLayer(marker)
    markerRefs.value.set(markerData.id, marker)
  })
}

defineExpose({
  panTo,
  openMarkerPopup
})

watch(() => [props.latitude, props.longitude], updateMarker)
watch(() => props.markers, updateMarkers, { deep: true })
watch(() => props.selectedRegion, () => {
  if (map && props.searchMode) {
    console.log(props.selectedRegion,'watch')
    const region = regionCenters[props.selectedRegion] || regionCenters['TW']
    map.setView([region.lat, region.lon], props.zoom)
  }
})

onMounted(() => {
  initMap()
  if (props.markers.length > 0) {
    updateMarkers()
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <!-- {{isPopupFromList}}
  {{ props.longitude }} -->
  <div ref="mapContainer" :style="{ height: height }" class="w-full rounded-lg overflow-hidden shadow-md"></div>
</template>
<style scoped>
@import 'leaflet/dist/leaflet.css';
/* 添加自定義提示樣式 */
:deep(.custom-tooltip) {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #3b82f6;
  border-radius: 6px;
  padding: 8px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.1);
}

:deep(.leaflet-tooltip-content) {
  min-width: 150px;
  max-width: 250px;
}
</style>
