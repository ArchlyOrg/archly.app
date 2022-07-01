import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { HeroMap, MapMarker, SitesList } from '@archly/components'
import type { Site } from '@archly/types'
import { heroMapConfig, mapsApiKey } from '@archly/utils/constants'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { FaSpinner } from 'react-icons/fa'
import { useMoralis } from 'react-moralis'

const render = (status: Status): ReactElement => {
  switch (status) {
    case Status.LOADING:
      return <FaSpinner fontSize='3em' color='green.100' />
    case Status.FAILURE:
      return <p>Error: Couldn&apos;t load map</p>
    case Status.SUCCESS:
      return <HeroMap />
    default:
      return <p>Unknown</p>
  }
}

export default function HomePage(): JSX.Element {
  const { Moralis, isAuthenticated } = useMoralis()
  const wrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [primarySite, setPrimarySite] = useState<Site | undefined>()
  const [primaryCoords, setPrimaryCoords] = useState<
    google.maps.LatLngLiteral | undefined
  >(
    primarySite !== undefined
      ? ({
          lat: primarySite.lat,
          lng: primarySite.lng
        } as unknown as google.maps.LatLngLiteral)
      : heroMapConfig.center
  )

  const getPrimarySite = useCallback(async (): Promise<Site | undefined> => {
    try {
      setLoading(true)
      const Sites = Moralis.Object.extend('Sites') as string
      const query = new Moralis.Query(Sites)
      query.equalTo('primarySite', true)

      const result = await query.find()
      setPrimarySite(result[0].attributes as Site)
      setPrimaryCoords({
        lat: result[0].attributes.lat as number,
        lng: result[0].attributes.lng as number
      } as unknown as google.maps.LatLngLiteral)
      setLoading(false)
      return result[0].attributes as Site
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error:', error)
      return undefined
    }
  }, [Moralis.Object, Moralis.Query])

  useEffect(() => {
    if (primarySite === undefined) {
      getPrimarySite()
        .then(result => {
          setLoading(false)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error:', error)
          setLoading(false)
        })
    }
  }, [primarySite, getPrimarySite])

  return (
    <main ref={wrapper} className='w-100 flex-col flex-wrap'>
      <section
        id='home'
        className='w-100 border-1 relative flex h-screen flex-col content-center items-center justify-center bg-darkish'
      >
        <Wrapper apiKey={mapsApiKey} render={render}>
          <HeroMap centerCoords={primaryCoords}>
            <MapMarker
              title={primarySite?.name}
              key='HeroMarker'
              position={primaryCoords}
              visible
              site={primarySite}
            />
          </HeroMap>
        </Wrapper>
        <div className='section__content border-1 relative mt-28 max-w-screen-2xl text-center'>
          <h1>Archly</h1>
          <p>The Social App for Archaeology Nerds.</p>
        </div>
      </section>
      <section className='w-100 relative flex h-screen flex-col content-center items-center  justify-center bg-darkish dark:bg-darkish'>
        <div className='section__content w-3/4'>
          <SitesList />
        </div>
      </section>
    </main>
  )
}
