import { useCallback, useRef, useState } from 'react'

import { LoadingOrError } from '@archly/components'
import type { Site } from '@archly/types'
import {
  heroMapConfig,
  localSitesMapConfig,
  mapsApiKey
} from '@archly/utils/constants'
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api'
import { useNotification } from 'web3uikit'
import type { TIconType } from 'web3uikit/dist/components/Icon/collection'
import type {
  IPosition,
  notifyType
} from 'web3uikit/dist/components/Notification/types'

import '@archly/styles/Maps.css'

interface LocalSitesMapProperties {
  sites?: Site[]
}

// interface MarkerClusterProperties extends MarkerClusterer {
//   site: Site
// }

function RenderMap({ sites }: LocalSitesMapProperties): JSX.Element {
  const reference = useRef<HTMLDivElement>(null)
  const [sitesMap, setSitesMap] = useState<google.maps.Map | null>()
  // const { theme }: UseDarkModeType = useDarkMode()
  // const isDark = theme === 'dark'
  const mapOptions = {
    localSitesMapConfig
    // styles: !isDark ? mapStylesLight.styles : localSitesMapConfig.styles
  }
  const { center } = heroMapConfig
  // const markers: google.maps.Marker[] & MapMarkerProperties[] = useMemo(
  //   () => [],
  //   []
  // )
  // const offsetX = -0.25
  // const offsetY = 0.6
  const markerWidth = 75
  const markerHeight = 100
  const [activeMarker, setActiveMarker] = useState<string>()
  const onHandleActiveMarker = useCallback(
    (marker: string) => {
      if (marker === activeMarker) {
        return
      }
      setActiveMarker(marker)
    },
    [activeMarker]
  )
  // eslint-disable-next-line unicorn/no-useless-undefined
  const onClearActiveMarker = (): void => setActiveMarker(undefined)
  const [userPos, setUserPos] = useState<GeolocationPosition | undefined>()
  const [loading, setLoading] = useState(false)
  const markerSize = useRef<google.maps.Size>(
    new google.maps.Size(markerWidth, markerHeight)
  )

  const onHandleUnmount = useCallback(() => {
    // eslint-disable-next-line unicorn/no-null
    setSitesMap(null)
  }, [])

  const dispatch = useNotification()
  const handleGeoLocNotification = useCallback(
    (
      type: notifyType,
      icon?: TIconType,
      position?: IPosition,
      message?: string,
      title?: string,
      id?: string
    ): void => {
      dispatch({
        id,
        type,
        title,
        icon,
        position: position ?? 'topR',
        message
      })
    },
    [dispatch]
  )

  const labelOffsetX = 30
  const labelOffsetY = 0
  const timeout = 2000
  const getGeoLocation = useCallback(
    async (
      map: google.maps.Map,
      mapBounds: google.maps.LatLngBounds
    ): Promise<GeolocationPosition | undefined> => {
      const options = {
        enableHighAccuracy: true,
        timeout,
        maximumAge: 0
      }
      try {
        setLoading(true)
        if (typeof navigator !== 'undefined') {
          console.log('navigator', navigator.geolocation)

          navigator.geolocation.getCurrentPosition(
            (
              position: GeolocationPosition
            ): GeolocationPosition | GeolocationPositionError | undefined => {
              if (position.coords.latitude && position.coords.longitude) {
                setUserPos(position)
                setLoading(false)
                console.log('position', position)
                setTimeout(() => {
                  handleGeoLocNotification(
                    'success',
                    'check',
                    'bottomR',
                    'Your location has been successfully retrieved.',
                    'GeoLocation retrieved'
                  )
                  const coords = new google.maps.LatLng(
                    position.coords.latitude,
                    position.coords.longitude
                  )
                  console.log('coords', mapBounds)
                  mapBounds.extend(coords)
                  const userCenter = mapBounds.getCenter()
                  // map.setZoom
                  map.panTo(userCenter)
                  map.fitBounds(mapBounds)
                }, timeout)
                return position
              }
              throw new Error('No coordinates found')
            },
            error => {
              setLoading(false)
              return error
            },
            options
          )
          return undefined
        }
      } catch {
        setLoading(false)
        return undefined
      }
      return userPos ?? undefined
    },
    [handleGeoLocNotification, userPos]
  )

  const onHandleOnLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      const bounds = new google.maps.LatLngBounds()
      if (loading) {
        handleGeoLocNotification(
          'info',
          'pin',
          'bottomR',
          'Attempting to retrieve your coordinates.',
          'GeoLocation'
        )
      }
      const userLocation = getGeoLocation(mapInstance, bounds)
      userLocation
        .then(position => {
          if (position?.coords.latitude && position.coords.longitude) {
            console.log('userLocation', position)
            handleGeoLocNotification(
              'success',
              'check',
              'bottomR',
              'Your location has been successfully retrieved.',
              'GeoLocation retrieved'
            )
            // setUserPos(position)
            // const userMarker: google.maps.Marker | undefined =
            //   position.coords.latitude && position.coords.longitude
            //     ? new google.maps.Marker({
            //         position: {
            //           lat: position.coords.latitude,
            //           lng: position.coords.longitude
            //         },
            //         title: 'Your current position',
            //         label: 'You are here!',
            //         icon: {
            //           url: '/md-pin.svg',
            //           scaledSize: markerSize.current
            //         },
            //         map: sitesMap
            //       })
            //     : undefined
            // // userMarker && latlngBounds.current && latlngBounds.current.extend(userMarker.getPosition());
            // userMarker?.setAnimation(google.maps.Animation.DROP)
          }
        })
        .catch(() => {
          // eslint-disable-next-line no-console
          console.log('error')
        })

      if (sites && sites.length > 0) {
        for (const { lat, lng } of sites) {
          const position = new google.maps.LatLng(
            Number.parseFloat(lat),
            Number.parseFloat(lng)
          )
          bounds.extend(position)
        }
        mapInstance.fitBounds(bounds)
        if (userPos !== undefined) {
          const userLatLng = new google.maps.LatLng(
            userPos.coords.latitude,
            userPos.coords.longitude
          )
          // mapInstance.panTo(
          //   new google.maps.LatLng(
          //     userPos.coords.latitude,
          //     userPos.coords.longitude
          //   )
          // )
          bounds.extend(userLatLng)
        }
        setSitesMap(mapInstance)
      }
    },
    [getGeoLocation, handleGeoLocNotification, loading, sites, userPos]
  )

  // useEffect(() => {
  //   if (sitesMap && isDark) {
  //     onHandleOnLoad(sitesMap)
  //   }
  // }, [isDark, onHandleOnLoad, sitesMap])
  return (
    <div ref={reference} className='map absolute top-0 left-0 h-screen w-full'>
      <GoogleMap
        mapContainerStyle={{
          height: '100%',
          width: '100%',
          position: 'absolute',
          top: 0,
          left: 0
        }}
        options={localSitesMapConfig as google.maps.MapOptions}
        center={center}
        onLoad={onHandleOnLoad}
        onUnmount={onHandleUnmount}
      >
        {userPos ? (
          <Marker
            title={`Lat: ${userPos.coords.latitude}, Lng: ${userPos.coords.longitude}`}
            label={{
              text: 'You are here!',
              // eslint-disable-next-line unicorn/no-keyword-prefix
              className: 'user-marker'
            }}
            key='userPosMarker'
            position={{
              lat: userPos.coords.latitude,
              lng: userPos.coords.longitude
            }}
            visible
            onClick={(): void => onHandleActiveMarker('userPosMarker')}
            icon={{
              url: '/md-drop-pin.svg',
              scaledSize: markerSize.current,
              labelOrigin: {
                x: labelOffsetX,
                y: labelOffsetY
              } as google.maps.Point
            }}
          />
        ) : undefined}
        {sites && sites.length > 0
          ? sites.map(site => {
              const { siteId, name, lat, lng, description } = site
              const id = `marker-${siteId}`
              const link = `/site/${siteId}`
              const position = {
                lat: Number.parseFloat(lat),
                lng: Number.parseFloat(lng)
              } as google.maps.LatLngLiteral

              return (
                <Marker
                  title={name}
                  key={id}
                  position={position}
                  visible
                  onClick={(): void => onHandleActiveMarker(id)}
                  icon={{
                    url: '/md-pin.svg',
                    scaledSize: markerSize.current
                  }}
                >
                  {activeMarker === id ? (
                    <InfoWindow onCloseClick={onClearActiveMarker}>
                      <div
                        className='info-window-content'
                        data-id={`infoWindow-${siteId}`}
                      >
                        <div className='site-notice'>
                          <div className='info-window-content-body'>
                            <h4>{name}</h4>
                            <p>{description}</p>
                            <a
                              className='info-button text-blue-600'
                              data-buttonId={`infoWindow-${siteId}`}
                              href={link}
                            >
                              More info
                            </a>
                          </div>
                        </div>
                      </div>
                    </InfoWindow>
                  ) : undefined}
                </Marker>
              )
            })
          : undefined}
      </GoogleMap>
    </div>
  )
}

function LocalSitesMap({ sites }: LocalSitesMapProperties): JSX.Element {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsApiKey
  })

  if (loadError) {
    return <LoadingOrError error={loadError} />
  }

  return isLoaded ? <RenderMap sites={sites} /> : <LoadingOrError />
}

export default LocalSitesMap

RenderMap.defaultProps = {
  sites: undefined
}

LocalSitesMap.defaultProps = {
  sites: undefined
}
