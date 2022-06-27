import { heroMapConfig, siteMapConfig } from '@archly/utils/constants'
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState
} from 'react'
import type { HeroMapProperties } from './HeroMap'

function SiteMap({ centerCoords, children }: HeroMapProperties): JSX.Element {
  const reference = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | undefined>()
  const { zoom } = siteMapConfig
  const { center, styles, disableDefaultUI } = heroMapConfig

  useEffect(() => {
    if (reference.current && !map && centerCoords) {
      // console.log('mapCenter: ', mapCenter.current);

      setMap(
        new google.maps.Map(reference.current as HTMLElement, {
          center: centerCoords,
          zoom,
          styles,
          disableDefaultUI,
          mapTypeId: 'satellite'
        })
      )
    }
  }, [reference, map, center, zoom, styles, disableDefaultUI, centerCoords])

  useEffect(() => {
    if (map && centerCoords) {
      map.panTo(centerCoords)
    }
  }, [map, centerCoords])

  return (
    <>
      <div ref={reference} className='w-100 h-100 absolute top-0 left-0' />
      {Children.map(children, child => {
        if (isValidElement(child as JSX.Element)) {
          return cloneElement(child as JSX.Element, {
            map
          })
        }
        return child as JSX.Element
      })}
    </>
  )
}

export default SiteMap
