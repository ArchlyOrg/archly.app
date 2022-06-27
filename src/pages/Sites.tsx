import type { ReactElement } from 'react'
import { useRef } from 'react'

import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { FaSpinner } from 'react-icons/fa'
import { initThinBackend, query } from 'thin-backend'
import {
  // useIsLoggedIn,
  useQuery
} from 'thin-backend-react'

import { LocalSitesMap, MapMarker } from '@archly/components/maps'
import { mapsApiKey } from '@archly/utils/constants'

initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL })

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
  const sites = useQuery(query('sites').orderByDesc('createdAt'))
  // const isLoggedIn = useIsLoggedIn()
  const wrapper = useRef<HTMLDivElement>(null)

  return (
    <div ref={wrapper}>
      {/* <Head>
				<title>archly: Sites</title>
				<meta
					name='description'
					content='archly: A social app for Archaeology nerds.'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head> */}
      <main>
        <section>
          <div className='section__content w-full'>
            <Wrapper apiKey={mapsApiKey} render={render}>
              <LocalSitesMap>
                {sites
                  ? sites.map(site => {
                      const { id, name, coords } = site
                      const { lat, lng } = JSON.parse(coords) as {
                        lat: number
                        lng: number
                      }

                      return (
                        <MapMarker
                          title={name}
                          key={`marker-${id}`}
                          position={{ lat, lng }}
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
    </div>
  )
}
