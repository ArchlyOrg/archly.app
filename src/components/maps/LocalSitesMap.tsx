import type { ReactNode } from 'react'
import {
  Children,
  cloneElement,
  isValidElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'

// import type { Site } from 'thin-backend'
import Loader from '@archly/components/Loader'
import { heroMapConfig, localSitesMapConfig } from '@archly/utils/constants'
import { handleLocationError } from '@archly/utils/helpers'
import { MarkerClusterer } from '@googlemaps/markerclusterer'

import type { MapMarkerProperties } from './MapMarker'

interface LocalSitesMapProperties {
  children?: ReactNode
}

// interface MarkerClusterProperties extends MarkerClusterer {
//   site: Site
// }

function LocalSitesMap({ children }: LocalSitesMapProperties): JSX.Element {
  const reference = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | undefined>()
  const { zoom, styles } = localSitesMapConfig
  const { center, disableDefaultUI } = heroMapConfig
  const markers: MapMarkerProperties[] = useMemo(() => [], [])
  // const offsetX = -0.25
  // const offsetY = 0.6
  // const markerWidth = 75
  // const markerHeight = 100
  const [userPos, setUserPos] = useState<GeolocationPosition | undefined>()
  const [loading, setLoading] = useState(false)
  // const markerSize = useRef<google.maps.Size>(
  //   new google.maps.Size(markerWidth, markerHeight)
  // )
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
    if (reference.current && !map) {
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
  }, [center, disableDefaultUI, map, styles, userPos, geoLocation, zoom])

  useEffect(() => {
    if (userPos && map) {
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
  }, [map, userPos, latlngBounds, markers])

  return (
    <>
      <div ref={reference} className='absolute top-0 left-0 h-screen w-full' />
      {Children.map(children, (child, index) => {
        if (isValidElement(child)) {
          const { site } = child.props as MapMarkerProperties

          // eslint-disable-next-line @typescript-eslint/no-magic-numbers
          if (index === 5) {
            console.log('markers 2:', markers)
            const markerCluster = new MarkerClusterer({
              map,
              markers
            })
            return cloneElement(child, {
              markerCluster
            })
          }
          const { lat, lng } = center as google.maps.LatLngLiteral
          const position = site
            ? {
                lat: site.lat as unknown as number,
                lng: site.lng as unknown as number
              }
            : { lat, lng }
          markers.push(child.props as MapMarkerProperties)
          latlngBounds.current.extend(new google.maps.LatLng(position))
          return cloneElement(child, {
            map
          })
        }
        return loading ? <Loader /> : child
      })}
    </>
  )
}

export default LocalSitesMap

LocalSitesMap.defaultProps = {
  children: undefined
}
