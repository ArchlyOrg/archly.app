import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { HeroMap, MapMarker, SitesList } from '@archly/components'
import { heroMapConfig, mapsApiKey } from '@archly/utils/constants'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { FaSpinner } from 'react-icons/fa'
import type { Site } from 'thin-backend'
import { query } from 'thin-backend'

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
  // const { center } = heroMapConfig
  const wrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [primarySite, setPrimarySite] = useState<Site | undefined>()
  const [primaryCoords, setPrimaryCoords] = useState<
    google.maps.LatLngLiteral | undefined
  >(
    primarySite !== undefined
      ? (JSON.parse(primarySite.coords) as google.maps.LatLngLiteral)
      : heroMapConfig.center
  )
  console.log('primary:', primarySite)

  const getPrimarySite = useCallback(async () => {
    console.log('Fetching site...')
    setLoading(true)

    // try {
    query('sites')
      .where('primarySite', true)
      .fetchOne()
      .then(site => {
        console.log('Fetched site:', site)

        // if (site) {
        //   setPrimarySite(site)
        //   console.log('primary:', primarySite)
        //   setPrimaryCoords(JSON.parse(site.coords) as google.maps.LatLngLiteral)
        //   setLoading(false)
        // }
      })
      .catch(error => {
        console.error('Error getting primarysite:', error)
        setLoading(false)
      })
      .finally(() => {
        setLoading(false)
      })
    // } catch (error) {
    //   // eslint-disable-next-line no-console
    //   console.log('error:', error)
    // }
  }, [setLoading])

  useEffect(() => {
    if (!primarySite) {
      getPrimarySite()
        .then(() => {
          console.log('primary:', primarySite)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error(error)
        })
    }
  }, [primarySite, getPrimarySite])

  return (
    <div ref={wrapper}>
      <main className='flex-column w-100 flex-wrap'>
        <section
          id='home'
          className='w-100 border-1 relative h-screen content-center items-center justify-center bg-darkish'
        >
          <Wrapper apiKey={mapsApiKey} render={render}>
            {loading && primaryCoords ? (
              <div>
                <FaSpinner fontSize='3em' color='green.100' />
              </div>
            ) : (
              <HeroMap
                centerCoords={primaryCoords as google.maps.LatLngLiteral}
              >
                <MapMarker
                  title={primarySite?.name}
                  key='HeroMarker'
                  position={primaryCoords}
                  visible
                  site={primarySite}
                />
              </HeroMap>
            )}
          </Wrapper>
          <div className='relative mt-28 text-center'>
            <h1>Archly</h1>
            <p>The Social App for Archaeology Nerds.</p>
          </div>
        </section>
        <section className='w-100 relative h-screen content-center items-center bg-gray-400 dark:bg-darkish'>
          <div className='section__content w-100'>
            <SitesList />
          </div>
        </section>
      </main>
    </div>
  )
}
