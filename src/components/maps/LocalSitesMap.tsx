import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { LoadingOrError } from '@archly/components'
import type { Site } from '@archly/types'
import {
  heroMapConfig,
  localSitesMapConfig,
  mapsApiKey
} from '@archly/utils/constants'
import { handleLocationError } from '@archly/utils/helpers'
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
// import type { Site } from 'thin-backend'
// import { MarkerClusterer } from '@googlemaps/markerclusterer'

import type { MapMarkerProperties } from './MapMarker'

interface LocalSitesMapProperties {
  sites?: Site[]
}

// interface MarkerClusterProperties extends MarkerClusterer {
//   site: Site
// }

function LocalSitesMap({ sites }: LocalSitesMapProperties): JSX.Element {
  const winDefined = typeof window !== 'undefined'

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsApiKey,
    preventGoogleFontsLoading: true
  })
  const reference = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>()
  const { zoom, styles } = localSitesMapConfig
  const { center, disableDefaultUI } = heroMapConfig
  const markers: google.maps.Marker[] & MapMarkerProperties[] = useMemo(
    () => [],
    []
  )
  // const offsetX = -0.25
  // const offsetY = 0.6
  // const markerWidth = 75
  // const markerHeight = 100
  const [userPos, setUserPos] = useState<GeolocationPosition | undefined>()
  const [loading, setLoading] = useState(false)
  // const markerSize = useRef<google.maps.Size>(
  //   new google.maps.Size(markerWidth, markerHeight)
  // )
  const onLoad = useCallback(
    (m: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds(center)
      m.fitBounds(bounds)
      setMap(m)
    },
    [center]
  )

  const onUnmount = useCallback(() => {
    // eslint-disable-next-line unicorn/no-null
    setMap(null)
  }, [])
  const latlngBounds = useRef(new google.maps.LatLngBounds())
  const timeout = 10_000
  const geoLocation = useCallback(() => {
    const options = {
      enableHighAccuracy: false,
      timeout,
      maximumAge: 0
    }

    if (typeof navigator !== 'undefined') {
      setLoading(true)
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          // const pos = {
          //   lat: position.coords.latitude,
          //   lng: position.coords.longitude
          // }
          setUserPos(position)
        },
        () => {
          handleLocationError(true)
        },
        options
      )
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false)
    }
    if (userPos) {
      setLoading(false)
    }
  }, [userPos])

  useEffect(() => {
    if (reference.current && !map && winDefined) {
      setMap(
        new google.maps.Map(reference.current as HTMLElement, {
          center: userPos
            ? {
                lat: userPos.coords.latitude,
                lng: userPos.coords.latitude
              }
            : center,
          zoom,
          disableDefaultUI,
          styles
        })
      )
    }
    if (!userPos) {
      geoLocation()
    }
  }, [
    center,
    disableDefaultUI,
    map,
    styles,
    userPos,
    geoLocation,
    zoom,
    winDefined
  ])

  useEffect(() => {
    if (userPos && map && winDefined) {
      // console.log('latlng', latlngBounds)
      // console.log('Your position:', userPosition)
      // console.log('latlngBounds:', latlngBounds)

      // const userCenter = latlngBounds.current && latlngBounds.current.getCenter()
      // console.log('userCenter: ', userCenter.lat(), userCenter.lng());
      // latlngBounds.current && map.fitBounds(latlngBounds.current);
      // if (!userPosition) {
      //   map.panTo({lat: userCenter.lat(), lng: userCenter.lng()});
      // } else {
      //   console.log('userPosition: ', userPosition);

      // latlngBounds.current && latlngBounds.current && latlngBounds.current.extend({lat: userPosition.coords.latitude, lng: userPosition.coords.longitude});

      //   map.panTo(userCenter);
      // }

      const userMarker: google.maps.Marker = new google.maps.Marker({
        position: {
          lat: userPos.coords.latitude,
          lng: userPos.coords.longitude
        },
        title: 'Your current position',
        label: 'You are here!',
        map
      })
      // userMarker && latlngBounds.current && latlngBounds.current.extend(userMarker.getPosition());
      userMarker.setAnimation(google.maps.Animation.DROP)

      // for (const element of markers) {
      //   // console.log('element:', element)
      //   // latlngBounds.current && latlngBounds.current.extend(new google.maps.LatLng(element.position.lat, markers[i].position.lng));
      // }
      // userMarker.setIcon({
      //   url: '/md-drop-pin.svg',
      //   scaledSize: markerSize.current,
      // })
    }
  }, [map, userPos, latlngBounds, markers, winDefined])

  if (loadError) {
    return <LoadingOrError error={loadError} />
  }

  return (
    <div ref={reference} className='map absolute top-0 left-0 h-screen w-full'>
      {isLoaded ? (
        <GoogleMap
          mapContainerStyle={{
            height: '100%',
            width: '100%',
            position: 'absolute',
            top: 0,
            left: 0
          }}
          options={localSitesMapConfig}
          zoom={zoom}
          center={center}
          onLoad={onLoad}
          onUnmount={onUnmount}
        >
          {sites && sites.length > 0
            ? sites.map(site => {
                const { siteId, name, lat, lng } = site
                const position = {
                  lat: Number.parseFloat(lat),
                  lng: Number.parseFloat(lng)
                } as google.maps.LatLngLiteral

                return (
                  <Marker
                    title={name}
                    key={`marker-${siteId}`}
                    position={position}
                    visible
                    // site={site}
                  />
                )
              })
            : undefined}
        </GoogleMap>
      ) : (
        <LoadingOrError />
      )}
    </div>
  )
}

export default LocalSitesMap

LocalSitesMap.defaultProps = {
  sites: undefined
}
