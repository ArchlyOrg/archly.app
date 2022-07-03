import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { LocalSitesMap, MapMarker } from '@archly/components'
import type { Site } from '@archly/types'
import { mapsApiKey } from '@archly/utils/constants'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { FaSpinner } from 'react-icons/fa'
import { useMoralis } from 'react-moralis'

const render = (status: Status): ReactElement => {
  switch (status) {
    case Status.LOADING:
      return <FaSpinner fontSize='3em' color='green' />
    case Status.FAILURE:
      return <p>Error: Couldn&apos;t load map</p>
    case Status.SUCCESS:
      return <LocalSitesMap />
    default:
      return <p>Unknown status</p>
  }
}

export default function SitesPage(): ReactElement {
  const { Moralis, account, isAuthenticated } = useMoralis()
  const [sites, setSites] = useState<Site[]>()
  const [loading, setLoading] = useState<boolean>(false)
  // const isLoggedIn = useIsLoggedIn()
  const wrapper = useRef<HTMLDivElement>(null)

  const fetchSites = useCallback(async (): Promise<Site[] | string> => {
    try {
      setLoading(true)
      const Sites = Moralis.Object.extend('Sites') as string
      const query = new Moralis.Query(Sites)
      const limit = 5
      query.limit(limit)
      const result = await query.find()
      console.log('fetch sites result:', result)

      const array = []
      let site = {}
      for (const element of result) {
        site = {
          ...site,
          ...element.attributes,
          siteId: element.id
        }
        array.push(site)
      }
      setLoading(false)
      setSites(array as Site[])
      return array as Site[]
    } catch (error) {
      console.error('Error fetching sites:', error)
      return 'Error fetching sites'
    }
  }, [Moralis.Object, Moralis.Query])

  useEffect(() => {
    if (!sites) {
      fetchSites()
        .then(() => {
          console.log('Sites fetched')
        })
        .catch(error => {
          console.error('Error fetching sites:', error)
        })
    }
  }, [fetchSites, sites])

  return (
    <main ref={wrapper}>
      <section className='w-100 relative flex h-screen flex-col content-center items-center  justify-center bg-darkish dark:bg-darkish'>
        <div className='section__content w-3/4'>
          <Wrapper apiKey={mapsApiKey} render={render}>
            <LocalSitesMap>
              {sites && sites.length > 0
                ? sites.map(site => {
                    const { siteId, name, lat, lng } = site

                    return (
                      <MapMarker
                        title={name}
                        key={`marker-${siteId}`}
                        position={
                          { lat, lng } as unknown as google.maps.LatLngLiteral
                        }
                        visible
                        site={site}
                      />
                    )
                  })
                : undefined}
            </LocalSitesMap>
          </Wrapper>
          <div className='relative'>
            <div className='flex flex-row gap-2'>
              <h1>archly sites</h1>
            </div>
            <p className='mb-1 text-lg leading-loose md:text-xl'>
              Search, browse, discover &amp; learn about
              <br /> the world of Archaeology.
            </p>
          </div>
        </div>
      </section>
    </main>
  )
}