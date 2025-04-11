import axios from 'axios';
import i18n from '../i18n';

const NOMINATIM_API_BASE = 'https://nominatim.openstreetmap.org/search';

// 預設地區中心點
export const regionCenters = {
  TW: { lat: 23.5, lon: 121, name: '台灣' },
  JP: { lat: 35.6762, lon: 139.6503, name: '日本' },
  US: { lat: 37.0902, lon: -95.7129, name: '美國' },
  FR: { lat: 46.2276, lon: 2.2137, name: '法國' },
  UK: { lat: 55.3781, lon: -3.436, name: '英國' },
  KR: { lat: 35.9078, lon: 127.7669, name: '韓國' },
  SG: { lat: 1.3521, lon: 103.8198, name: '新加坡' },
  TH: { lat: 15.87, lon: 100.9925, name: '泰國' },
};

export const searchByNominatim = async (query = '', region = 'TW') => {
  try {
    if (!query.trim()) {
      return [];
    }

    const location = regionCenters[region] || regionCenters['TW'];
    const viewbox = `${location.lon - 1},${location.lat - 1},${
      location.lon + 1
    },${location.lat + 1}`;

    const params = {
      q: query,
      format: 'json',
      addressdetails: 1,
      viewbox: viewbox,
      bounded: 1,
      limit: 20,
    };

    const response = await axios.get(NOMINATIM_API_BASE, { params });

    if (!response.data || response.data.length === 0) {
      return [];
    }

    return response.data.map(place => ({
      id: place.place_id.toString(),
      name: place.display_name.split(',')[0],
      city: regionCenters[region].name,
      description: place.display_name,
      image: 'https://via.placeholder.com/400x300',
      rating: 0,
      location: {
        lat: parseFloat(place.lat),
        lng: parseFloat(place.lon),
      },
    }));
  } catch (error) {
    console.error('Nominatim search error:', error);
    if (error.response) {
      switch (error.response.status) {
        case 400:
          throw new Error(i18n.global.t('errors.invalidParams'));
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
