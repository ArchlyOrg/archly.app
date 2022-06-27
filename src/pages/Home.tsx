import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { FaSpinner } from 'react-icons/fa'
import type { Site } from 'thin-backend'
import { initThinBackend, query } from 'thin-backend'

import { SitesList } from '@archly/components'

import { HeroMap, MapMarker } from '../components/maps'
import { heroMapConfig } from '../utils/constants'

initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL })
const mapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  ? process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.toString()
  : ''

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
  const { center } = heroMapConfig
  const wrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [primarySite, setPrimarySite] = useState<Site | undefined>()
  const [primaryCoords, setPrimaryCoords] = useState<
    google.maps.LatLngLiteral | undefined
  >(
    primarySite
      ? (JSON.parse(primarySite.coords) as google.maps.LatLngLiteral)
      : undefined
  )
  console.log('primary:', primarySite)

  const getPrimarySite = useCallback(async () => {
    console.log('Fetching site...')
    setLoading(true)

    const site = await query('sites').where('primarySite', true).fetchOne()
    if (site.id) {
      setPrimarySite(site)
      console.log('primary:', primarySite)
      setPrimaryCoords(JSON.parse(site.coords) as google.maps.LatLngLiteral)
      setLoading(false)
    }
  }, [primarySite, setLoading, setPrimarySite])

  useEffect(() => {
    if (!primarySite) {
      getPrimarySite()
        .then(() => {
          console.log('primary:', primarySite)
        })
        .catch(error => {
          console.error(error)
        })
    }
  }, [primarySite, getPrimarySite])

  return (
    <div ref={wrapper}>
      <main className='flex-column flex w-screen flex-nowrap'>
        <section className='w-100 relative h-screen content-center items-center'>
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
        <section>
          <div className='section__content w-100'>
            <SitesList />
          </div>
        </section>
      </main>
    </div>
  )
}
