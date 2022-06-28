import type { ReactNode } from 'react'
import {
  Children,
  cloneElement,
  isValidElement,
  useEffect,
  useRef,
  useState
} from 'react'

import { heroMapConfig } from '@archly/utils/constants'

export interface HeroMapProperties {
  centerCoords?: google.maps.LatLngLiteral
  children?: ReactNode
}

function HeroMap({ centerCoords, children }: HeroMapProperties): JSX.Element {
  const reference = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | undefined>()
  const { zoom, styles, disableDefaultUI } = heroMapConfig

  useEffect(() => {
    if (reference.current && !map && centerCoords) {
      setMap(
        new google.maps.Map(reference.current as HTMLElement, {
          center: centerCoords,
          zoom,
          styles,
          disableDefaultUI
        })
      )
    }
  }, [reference, map, styles, zoom, disableDefaultUI, centerCoords])

  return (
    <>
      <div
        ref={reference}
        className='absolute top-0 left-0 z-0 h-screen w-full'
      />
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

export default HeroMap

HeroMap.defaultProps = {
  centerCoords: { lat: 0, lng: 0 },
  children: undefined
}
