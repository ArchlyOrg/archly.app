import { useEffect, useMemo, useRef } from 'react'

import type { Site } from '@archly/types'
import { useNavigate } from 'react-router-dom'

export const contentString = (site: Site): string => {
  const { name, description, siteId } = site
  const link = `/sites/${siteId}`

  const content = `
  <div className="infoWindowContent" data-id="${siteId}">
    <div className="siteNotice">
      <h4 className="firstHeading">${name}</h4>
      <div className="bodyContent">
        <p>${description}</p>
        <button className="infoButton" data-buttonId="${siteId}" href="${link}">More info</button>
      </div>
    </div>
  </div>`
  return content
}
export interface MapMarkerProperties extends google.maps.Marker {
  site?: Site
}
export interface MapMarkerOptionsProperties extends google.maps.MarkerOptions {
  site?: Site
}
const markerWidth = 75
const markerHeight = 100

export function MapMarker(options: MapMarkerOptionsProperties): JSX.Element {
  const marker = useRef<MapMarkerProperties>()
  const markerSize = useRef<google.maps.Size>(
    new google.maps.Size(markerWidth, markerHeight)
  )
  const { site } = options
  const infoWindow = useMemo(
    () =>
      site
        ? new google.maps.InfoWindow({ content: '', disableAutoPan: true })
        : undefined,
    [site]
  )
  const navigate = useNavigate()
  const { siteId, name } = site ?? { siteId: undefined, name: undefined }
  // const contentString = useMemo(() => `<div>${options.site?.name}</div>`, [options.site?.name]);

  useEffect(() => {
    if (!marker.current) {
      marker.current = new google.maps.Marker() as MapMarkerProperties
    }

    return () => {
      // eslint-disable-next-line unicorn/no-null
      marker.current?.setMap(null)
    }
  }, [marker])

  useEffect(() => {
    if (marker.current) {
      marker.current.setIcon({
        url: '/md-pin.svg',
        scaledSize: markerSize.current
      })
      marker.current.setOptions(options)
      marker.current.setAnimation(google.maps.Animation.DROP)

      // console.log('marker: ', marker);
      if (infoWindow && site) {
        const zPlus = 1
        marker.current.addListener('click', () => {
          infoWindow.setContent(contentString(site))
          infoWindow.setZIndex(google.maps.Marker.MAX_ZINDEX + zPlus)
          infoWindow.open(marker.current?.getMap(), marker.current)
          // console.log('infoWindow:', infoWindow)
        })
      }
    }
    return () => {
      // eslint-disable-next-line unicorn/no-null
      marker.current?.setMap(null)
    }
  }, [marker, options, siteId, infoWindow, markerSize, navigate, site])

  useEffect(() => {
    if (marker.current && infoWindow) {
      // console.log('marker: ', marker);

      google.maps.event.addListener(infoWindow, 'domready', () => {
        if (siteId) {
          const button = document.querySelector(`[data-buttonId="${siteId}"]`)
          if (button) {
            // console.log(button)
            button.addEventListener('click', () => {
              // eslint-disable-next-line no-console
              console.log('button clicked:', siteId)
              navigate(`/sites/${siteId}`)
            })
          }
        }
      })
    }

    return () => {
      if (infoWindow) {
        google.maps.event.clearInstanceListeners(infoWindow)
      }
    }
  }, [infoWindow, marker, siteId, name, options, navigate])

  // return <>{`${marker.current ?? new google.maps.Marker()}`}</>
}

export default MapMarker

MapMarker.defaultProps = {
  site: undefined
}
