import { useCallback, useEffect, useState } from 'react'

import { NewSiteButton, SiteCard } from '@archly/components'
import type { Site } from '@archly/types'
import { FaSpinner } from 'react-icons/fa'
import { useMoralis } from 'react-moralis'

export default function SitesList(): JSX.Element {
  const { Moralis, isAuthenticated } = useMoralis()
  const [sites, setSites] = useState<Site[]>()
  const [loading, setLoading] = useState<boolean>(false)

  const fetchSites = useCallback(async (): Promise<Site[]> => {
    setLoading(true)
    const Sites = Moralis.Object.extend('SitesThirdWeb') as string
    const query = new Moralis.Query(Sites)

    const result = await query.find()

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
  }, [Moralis.Object, Moralis.Query])

  useEffect(() => {
    fetchSites()
      .then(result => {
        // eslint-disable-next-line no-console
        console.log('Fetched sites:', result)
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error fetching sites:', error)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchSites])

  return (
    <div>
      <div className='inline-flex items-center gap-x-2'>
        <h1>Sites</h1>
        {isAuthenticated ? (
          <NewSiteButton aria-label='Add a new site.' />
        ) : undefined}
      </div>
      <p className='text-md mt-0 mb-1 leading-loose lg:text-lg'>
        A few highlights, voted for by the communuty.
      </p>
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        {(loading ? (
          <FaSpinner fontSize='3em' />
        ) : (
          sites &&
          sites.length > 0 &&
          sites.map(site => (
            <SiteCard key={`site-${site.siteId}`} site={site} />
          ))
        )) ?? <p className='text-center text-gray-500'>No sites found.</p>}
      </div>
    </div>
  )
}
