import type { NewSiteValues } from '@archly/types'

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

export const mapStylesLight = {
  styles: [
    {
      "featureType": "administrative",
      "elementType": "labels.text.fill",
      "stylers": [
        {
          "color": "#384961"
        }
      ]
    },
    {
      "featureType": "administrative.land_parcel",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
        {
          "color": "#DEEBCC"
        }
      ]
    },
    {
      "featureType": "landscape.natural",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "visibility": "off"
        },
      ]
    },
    {
      "featureType": "poi",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        },
        {
          "color": "#C8DEAB"
        },
        {
          "saturation": "-30"
        },
        // {
        //   "lightness": "85"
        // }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "simplified"
        },
        {
          "lightness": "-53"
        },
        {
          "weight": "1.00"
        },
        {
          "gamma": "0.98"
        }
      ]
    },
    {
      "featureType": "poi",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "simplified"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "all",
      "stylers": [
        {
          "saturation": -100
        },
        {
          "lightness": 45
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "geometry",
      "stylers": [
        {
          "saturation": "-18"
        }
      ]
    },
    {
      "featureType": "road",
      "elementType": "labels",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.highway",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "road.arterial",
      "elementType": "labels.icon",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "road.local",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
        {
          "visibility": "off"
        }
      ]
    },
    {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
        {
          "color": "#78A9E3"
        },
        {
          "visibility": "on"
        }
      ]
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
  styles: mapStyles.styles,
  disableDefaultUI: true
}

const siteMapConfigZoom = 16
export const siteMapConfig = {
  mapTypeId: 'satellite',
  disableDefaultUI: true,
  styles: mapStyles.styles,
  zoom: siteMapConfigZoom
}

export const sitesContractAddress =
  '0x6D10A2CB392cad85370cF18f923f53B6694401db'.toLowerCase()

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
