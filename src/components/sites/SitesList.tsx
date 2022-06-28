import { NewSiteButton, SiteCard } from '@archly/components'
import { FaSpinner } from 'react-icons/fa'
import type { Site } from 'thin-backend'
import { query } from 'thin-backend'
import { useIsLoggedIn, useQuery } from 'thin-backend-react'


export default function SitesList(): JSX.Element {
  const sites = useQuery(query('sites').orderByDesc('createdAt'))
  // const user = useCurrentUser()
  const isLoggedIn = useIsLoggedIn()

  if (sites === null) {
    return (
      <div>
        <FaSpinner fontSize='3em' />
      </div>
    )
  }

  return (
    <div>
      <div className='inline-flex items-center gap-x-2'>
        <h1>Sites</h1>
        {isLoggedIn ? (
          <NewSiteButton aria-label='Add a new site.' />
        ) : undefined}
      </div>
      <p className='text-md mt-0 mb-1 leading-loose lg:text-lg'>
        A few highlights, voted for by the communuty.
      </p>
      <div className='grid-cols-1 gap-8 lg:grid-cols-2 xl:grid-cols-3'>
        {sites.map((site: Site) => (
          <SiteCard key={site.id} site={site} />
        ))}
      </div>
    </div>
  )
}
