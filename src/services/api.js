import axios from 'axios';
import { searchByNominatim } from './nominatim';
import i18n from '../i18n';

// Overpass API配置
const OVERPASS_API_BASE = 'https://overpass-api.de/api/interpreter';

// 預設地區中心點
const regionCenters = {
  TW: { lat: 23.5, lon: 121, name: '台灣' },
  JP: { lat: 35.6762, lon: 139.6503, name: '日本' },
  US: { lat: 37.0902, lon: -95.7129, name: '美國' },
  FR: { lat: 46.2276, lon: 2.2137, name: '法國' },
  UK: { lat: 55.3781, lon: -3.436, name: '英國' },
  KR: { lat: 35.9078, lon: 127.7669, name: '韓國' },
  SG: { lat: 1.3521, lon: 103.8198, name: '新加坡' },
  TH: { lat: 15.87, lon: 100.9925, name: '泰國' },
};

export const searchAttractions = async (
  query = '',
  region = 'TW',
  options = {}
) => {
  try {
    // 如果是地圖模式，使用Overpass API
    if (options.bounds) {
      let overpassQuery;
      const { north, south, east, west } = options.bounds;
      switch (options.category) {
        case 'food':
          overpassQuery = `
            [out:json][timeout:25];
            (
              node["amenity"="restaurant"](${south},${west},${north},${east});
              way["amenity"="restaurant"](${south},${west},${north},${east});
            );
            out body center qt;
          `;
          break;
        case 'cafe':
          overpassQuery = `
            [out:json][timeout:25];
            (
              node["amenity"="cafe"](${south},${west},${north},${east});
              way["amenity"="cafe"](${south},${west},${north},${east});
            );
            out body center qt;
          `;
          break;
        case 'hotel':
          overpassQuery = `
            [out:json][timeout:25];
            (
              node["tourism"~"hotel|hostel|motel|guest_house"](${south},${west},${north},${east});
              way["tourism"~"hotel|hostel|motel|guest_house"](${south},${west},${north},${east});
            );
            out body center qt;
          `;
          break;
        case 'park':
          overpassQuery = `
            [out:json][timeout:25];
            (
              node["leisure"="park"](${south},${west},${north},${east});
              way["leisure"="park"](${south},${west},${north},${east});
            );
            out body center qt;
          `;
          break;
        case 'shopping':
          overpassQuery = `
            [out:json][timeout:25];
            (
              node["shop"](${south},${west},${north},${east});
              way["shop"](${south},${west},${north},${east});
            );
            out body center qt;
          `;
          break;
        default:
          // 預設是景點
          overpassQuery = `
            [out:json][timeout:25];
            (
              node["tourism"~"attraction|museum|viewpoint"](${south},${west},${north},${east});
              way["tourism"~"attraction|museum|viewpoint"](${south},${west},${north},${east});
            );
            out body center qt;
          `;
      }

      const response = await axios.post(OVERPASS_API_BASE, overpassQuery, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (
        !response.data ||
        !response.data.elements ||
        response.data.elements.length === 0
      ) {
        return [];
      }

      // 將Overpass API返回的數據轉換為應用程序所需格式
      return response.data.elements
        .filter(element => element.tags && element.tags.name)
        .map(place => ({
          id: place.id.toString(),
          name: place.tags.name,
          city: regionCenters[region].name,
          description:
            place.tags.description ||
            [
              place.tags['addr:city'],
              place.tags['addr:district'],
              place.tags['addr:street'],
              place.tags['addr:housenumber']
                ? place.tags['addr:housenumber'] + '號'
                : null,
              place.tags['addr:floor'],
            ]
              .filter(Boolean)
              .join('') ||
            `位於${regionCenters[region].name}的${place.tags.name}`,
          rating: 0,
          location: {
            lat: place.lat || (place.center && place.center.lat),
            lng: place.lon || (place.center && place.center.lon),
          },
        }))
        .filter(
          attraction =>
            attraction.location &&
            typeof attraction.location.lat === 'number' &&
            typeof attraction.location.lng === 'number'
        )
        .slice(0, 20); // 限制返回結果數量
    } else {
      // 列表模式使用Nominatim API
      return await searchByNominatim(query, region);
    }
  } catch (error) {
    console.error('搜尋景點時發生錯誤:', error);
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(i18n.global.t('errors.invalidParams'));
        case 401:
          throw new Error(i18n.global.t('errors.unauthorized'));
        case 429:
          throw new Error(i18n.global.t('errors.tooManyRequests'));
        case 500:
          throw new Error(i18n.global.t('errors.serverError'));
        default:
          throw new Error(
            i18n.global.t('errors.serverErrorWithCode', {
              code: error.response.status,
            })
          );
      }
    } else if (error.request) {
      throw new Error(i18n.global.t('errors.networkError'));
    } else {
      throw new Error(i18n.global.t('errors.searchError'));
    }
  }
};
