import type { NewSiteValues } from "@archly/types"

export const initialSites = [
  {
    name: 'Site 1',
    userId: '1',
    description: 'This is a description',
    location: 'Here',
    coords: '{ "lat": 51.697332, "lng": -2.304548 }',
    media: '{}'
  },
  {
    name: 'Site 2',
    userId: '2',
    description: 'This is a description',
    location: 'Here',
    coords: '{ "lat": 51.697332, "lng": -2.304548 }',
    media: '{}'
  },
  {
    name: 'Site 3',
    userId: '3',
    description: 'This is a description',
    location: 'Here',
    coords: '{ "lat": 51.697332, "lng": -2.304548 }',
    media: '{}'
  },
  {
    name: 'Site 4',
    userId: '4',
    description: 'This is a description',
    location: 'Here',
    coords: '{ "lat": 51.697332, "lng": -2.304548 }',
    media: '{}'
  },
  {
    name: 'Site 5',
    userId: '5',
    description: 'This is a description',
    location: 'Here',
    coords: '{ "lat": 51.697332, "lng": -2.304548 }',
    media: '{}'
  }
]

export const mapStyles = {
  styles: [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }]
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }]
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }]
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }]
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }]
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }]
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }]
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }]
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }]
    }
  ]
}

export interface MapConfigProperties {
  center: Record<string, unknown>
  zoom: number
  styles: []
}
const heroConfigLat = 51.1789
const heroConfigLng = -1.8262
const heroConfigZoom = 4
export const heroMapConfig = {
  center: {
    lat: heroConfigLat,
    lng: heroConfigLng
  },
  zoom: heroConfigZoom,
  disableDefaultUI: true,
  styles: mapStyles.styles
}
const localSiteConfigZoom = 8
export const localSitesMapConfig = {
  zoom: localSiteConfigZoom,
  styles: mapStyles.styles
}

const siteMapConfigZoom = 16
export const siteMapConfig = {
  zoom: siteMapConfigZoom
}

export const sitesContractAddress = '0x8c728F7bAD0C99cB20a0b6532E264700dea47115'.toLocaleLowerCase()

const mapsKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY as string
export const mapsApiKey: string = mapsKey || ''

export const initialNewSiteValues = {
  siteName: '',
  siteDescription: '',
  siteLocation: '',
  siteLat: '',
  siteLng: '',
  siteImgUrl: '',
  siteWikiUrl: ''
} as NewSiteValues