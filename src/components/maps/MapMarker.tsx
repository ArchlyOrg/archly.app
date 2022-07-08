import { useEffect, useMemo, useRef } from 'react'

import type { Site } from '@archly/types'
import { useNavigate } from 'react-router-dom'

export const contentString = (site: Site): string => {
  const { name, description, siteId } = site
  const link = `/site/${siteId}`

  const content = `
  <div class="info-window-content" data-id="${siteId}">
    <div class="site-notice">
      <div class="info-window-content-body">
        <h4>${name}</h4>
        <p>${description}</p>
        <button class="info-button" data-buttonId="${siteId}" href="${link}">More info</button>
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

export function MapMarker(
  markerOptions: google.maps.MarkerOptions & MapMarkerOptionsProperties
): null {
  const marker = useRef<google.maps.Marker>()
  const markerSize = useRef<google.maps.Size>(
    new google.maps.Size(markerWidth, markerHeight)
  )
  const { site, title, position } = markerOptions
  // const coords = site ? {lat: Number.parseFloat(site.lat), lng: Number.parseFloat(site.lng)} : position
  // const options = { title, position, visible } as google.maps.MarkerOptions
  // console.log('MapMarker', markerOptions)

  const infoWindow = useMemo(
    () => new google.maps.InfoWindow({ content: '', disableAutoPan: true }),
    []
  )
  const navigate = useNavigate()
  const { siteId, name } = site ?? { siteId: undefined, name: undefined }

  useEffect(() => {
    if (!marker.current) {
      marker.current = new google.maps.Marker()
    }

    return () => {
      // eslint-disable-next-line unicorn/no-null
      marker.current?.setMap(null)
    }
  }, [marker])

  useEffect(() => {
    if (marker.current && position) {
      marker.current.setIcon({
        url: '/md-pin.svg',
        scaledSize: markerSize.current
      })
      marker.current.set('position', position as google.maps.LatLng)
      marker.current.setTitle(title)
      marker.current.setVisible(true)
      marker.current.setAnimation(google.maps.Animation.DROP)

      if (site) {
        const zPlus = 1
        marker.current.addListener('click', () => {
          infoWindow.setContent(contentString(site))
          infoWindow.setZIndex(google.maps.Marker.MAX_ZINDEX + zPlus)
          if (marker.current) {
            infoWindow.open({
              map: marker.current.getMap(),
              anchor: marker.current
            })
          }
        })
      }
    }
    return () => {
      // eslint-disable-next-line unicorn/no-null
      marker.current?.setMap(null)
    }
  }, [
    marker,
    siteId,
    infoWindow,
    markerSize,
    navigate,
    site,
    position,
    markerOptions,
    title
  ])

  useEffect(() => {
    if (marker.current && infoWindow.getContent() !== '') {
      google.maps.event.addListener(infoWindow, 'domready', () => {
        if (siteId !== undefined) {
          const button = document.querySelector(`[data-buttonId="${siteId}"]`)
          if (button) {
            // console.log(button)
            button.addEventListener('click', () => {
              // eslint-disable-next-line no-console
              console.log('button clicked:', siteId)
              navigate(`/site/${siteId}`)
            })
          }
        }
      })
    }

    return () => {
      // if (infoWindow) {
      google.maps.event.clearInstanceListeners(infoWindow)
      // }
    }
  }, [infoWindow, marker, siteId, name, navigate])

  // eslint-disable-next-line unicorn/no-null
  return null
}

export default MapMarker

MapMarker.defaultProps = {
  site: undefined
}
