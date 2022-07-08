import { useCallback, useRef, useState } from 'react'

import type { Site } from '@archly/types'
import { heroMapConfig, mapsApiKey } from '@archly/utils/constants'
import {
  GoogleMap,
  InfoWindow,
  Marker,
  useJsApiLoader
} from '@react-google-maps/api'

export interface HeroMapProperties {
  site?: Site
}

function RenderMap({ site }: HeroMapProperties): JSX.Element {
  const reference = useRef<HTMLDivElement>(null)
  const [heroMap, setHeroMap] = useState<google.maps.Map | undefined>()
  const { center, zoom } = heroMapConfig
  const markerWidth = 75
  const markerHeight = 100
  const markerSize = useRef<google.maps.Size>(
    new google.maps.Size(markerWidth, markerHeight)
  )
  const coords: google.maps.LatLngLiteral =
    site !== undefined
      ? {
          lat: Number.parseFloat(site.lat),
          lng: Number.parseFloat(site.lng)
        }
      : (center as google.maps.LatLngLiteral)
  const [activeMarker, setActiveMarker] = useState<string>()
  const onHandleActiveMarker = useCallback(
    (marker: string) => {
      if (marker === activeMarker) {
        console.log('activeMarker', marker)
        return
      }
      setActiveMarker(marker)
    },
    [activeMarker]
  )
  // eslint-disable-next-line unicorn/no-useless-undefined
  const onClearActiveMarker = (): void => setActiveMarker(undefined)

  const onHandleOnLoad = useCallback((mapInstance: google.maps.Map) => {
    setHeroMap(mapInstance)
    // const bounds = new google.maps.LatLngBounds()
  }, [])

  const { lat, lng, name, siteId, description } = site ?? {}
  console.log('desc', site)

  const id = `marker-${siteId ?? ''}`
  const link = `/site/${siteId ?? ''}`
  // useEffect(() => {
  //   if (!sites.length === 0) {
  //     onHandleOnLoad()
  //   }
  // }, []);
  return (
    <div ref={reference} className='absolute top-0 left-0 h-screen w-full'>
      <GoogleMap
        mapContainerStyle={{
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          position: 'absolute'
        }}
        options={heroMapConfig as google.maps.MapOptions}
        zoom={zoom}
        onLoad={onHandleOnLoad}
        onClick={onClearActiveMarker}
      >
        {site !== undefined ? (
          // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
          <Marker
            title={name}
            key={id}
            position={coords}
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
                  data-id={`infoWindow-${siteId ?? ''}`}
                >
                  <div className='site-notice'>
                    <div className='info-window-content-body'>
                      <h4>{name}</h4>
                      <p>{description}</p>
                      <a
                        className='info-button text-blue-600'
                        data-buttonId={`infoWindow-${siteId ?? ''}`}
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
        ) : undefined}
      </GoogleMap>
    </div>
  )
}
function HeroMap({ site }: HeroMapProperties): JSX.Element {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsApiKey
  })
  if (loadError) {
    console.log('loadError', loadError)

    return <div>Error</div>
  }

  return isLoaded ? <RenderMap site={site} /> : <div>Loading</div>
}

export default HeroMap

HeroMap.defaultProps = {
  site: undefined
}

RenderMap.defaultProps = {
  site: undefined
}
