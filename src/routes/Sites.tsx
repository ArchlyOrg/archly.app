import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { LocalSitesMap } from '@archly/components'
import type { Site } from '@archly/types'
import { useMoralis } from 'react-moralis'

export default function SitesPage(): ReactElement {
  const { Moralis } = useMoralis()
  const [sites, setSites] = useState<Site[]>()
  const [loading, setLoading] = useState<boolean>(false)
  // const isLoggedIn = useIsLoggedIn()
  const wrapper = useRef<HTMLDivElement>(null)

  const fetchSites = useCallback(async (): Promise<Site[] | undefined> => {
    try {
      setLoading(true)
      const Sites = Moralis.Object.extend('SitesThirdWeb') as string
      const query = new Moralis.Query(Sites)
      const limit = 5
      query.limit(limit)
      const result = await query.find()
      if (result.length > 0) {
        // eslint-disable-next-line no-console
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
        setSites(array as Site[])
        setLoading(false)
        return array as Site[]
      }

      throw new Error('No sites found')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching sites:', error)
      return undefined
    }
  }, [Moralis.Object, Moralis.Query])

  useEffect(() => {
    if (!sites) {
      fetchSites()
        .then(result => {
          if (result && result.length > 0) {
            // setSites(result as Site[])
            // console.log('result:', result)
          }
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.error('Error fetching sites:', error)
        })
    }
  }, [fetchSites, sites])

  return (
    <main ref={wrapper}>
      <section className='w-100 relative flex h-screen flex-col content-center items-center  justify-center bg-darkish dark:bg-darkish'>
        <LocalSitesMap sites={sites} />
        <div className='section__content w-3/4'>
          <div className='relative'>
            <div className='flex flex-row gap-2'>
              <h1>archly sites</h1>
            </div>
            <p className='mb-1 text-lg leading-loose md:text-xl'>
              Search, browse, discover &amp; learn about
              <br /> the world of Archaeology.
            </p>
            {loading ? <p>Loading sites...</p> : undefined}
          </div>
        </div>
      </section>
    </main>
  )
}
