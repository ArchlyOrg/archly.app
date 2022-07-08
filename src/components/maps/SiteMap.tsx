import { useCallback, useRef } from 'react'

import { LoadingOrError } from '@archly/components'
import { mapsApiKey, siteMapConfig } from '@archly/utils/constants'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api'

interface SiteMapProperties {
  centerCoords?: google.maps.LatLng | google.maps.LatLngLiteral
}

function RenderMap({ centerCoords }: SiteMapProperties): JSX.Element {
  const reference = useRef<HTMLDivElement>(null)

  const onHandleOnLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      if (centerCoords !== undefined) {
        mapInstance.setCenter(centerCoords)
        mapInstance.panTo(centerCoords)
      }
    },
    [centerCoords]
  )

  return (
    <div
      ref={reference}
      className='absolute top-0 left-0 h-screen w-full border-red-600'
    >
      <GoogleMap
        mapContainerStyle={{
          height: '100%',
          width: '100%',
          top: 0,
          left: 0,
          position: 'absolute'
        }}
        center={centerCoords as google.maps.LatLngLiteral}
        options={siteMapConfig as google.maps.MapOptions}
        onLoad={onHandleOnLoad}
      />
    </div>
  )
}

function SiteMap({ centerCoords }: SiteMapProperties): JSX.Element {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: mapsApiKey
  })

  // try {
  //   let coords = new google.maps.LatLng({ lat: 0, lng: 0 })
  //   if (centerCoords !== undefined) {
  //     coords = new google.maps.LatLng(centerCoords)
  //   }
  //   console.log('centerCoords', centerCoords)
  //   if (loadError) {
  //     throw new Error(loadError.message)
  //   }
  // } catch (error) {
  //   console.error(error)
  // }

  return isLoaded && centerCoords !== undefined ? (
    <RenderMap centerCoords={centerCoords} />
  ) : (
    <LoadingOrError />
  )
}

export default SiteMap

SiteMap.defaultProps = {
  centerCoords: undefined
}

RenderMap.defaultProps = {
  centerCoords: undefined
}
