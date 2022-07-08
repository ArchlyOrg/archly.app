import { useCallback, useEffect, useState } from 'react'

import {
  DeleteSiteButton,
  EditSiteButton,
  ViewSiteButton
} from '@archly/components'
import type { Site } from '@archly/types'
import { shortenAddress } from '@archly/utils/helpers'
import { useMoralis } from 'react-moralis'

interface SiteCardProperties {
  site: Site
}

/**
 * **Display a card for a site.**
 *
 * Contains summary information about the site and links to the site's details page.
 *
 * If a user is logged in and the creator of the site, they can edit or delete the site.
 *
 * @param site - `SiteCardProperties`
 * @returns JSX.Element
 */
export default function SiteCard({ site }: SiteCardProperties): JSX.Element {
  const { Moralis, isAuthenticated, account } = useMoralis()
  const [siteCreatedBy, setSiteCreatedBy] = useState<string | undefined>()
  const { lat, lng, description, name, location, owner, siteId } = site
  const [loading, setLoading] = useState(false)

  // fetch this site's owner from the _User class
  const fetchSiteUser = useCallback(async (): Promise<string | undefined> => {
    try {
      setLoading(true)
      const User = Moralis.Object.extend('_User') as string
      const query = new Moralis.Query(User)
      query.equalTo('ethAddress', owner.toLowerCase())
      const result = await query.first()

      if (result) {
        const { ethAddress } = result.attributes
        const address = ethAddress as string
        // TODO: when i sort the relational stuff in Moralis db for user profiles, this will want to change to the owners displayName
        const displayName: string =
          address.toLowerCase() === account?.toLowerCase()
            ? 'You'
            : shortenAddress(address)
        setSiteCreatedBy(displayName)
        setLoading(false)
        return ethAddress as string
      }
      setLoading(false)
      setSiteCreatedBy(shortenAddress(owner))
      return owner
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error:', error)

      return undefined
    }
  }, [Moralis.Object, Moralis.Query, account, owner])

  useEffect(() => {
    if (siteCreatedBy === undefined) {
      fetchSiteUser()
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('Site card result:', result)
          // setSiteCreatedBy(result)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error:', error)
        })
    }
  }, [fetchSiteUser, siteCreatedBy])

  return (
    <div className='site-card'>
      <div className='site-card__content font-medium'>
        <h3 className='mb-0'>{name}</h3>
        <p className='mb-1 text-lg'>{description}</p>
        <p className='mb-1 text-xs'>{location}</p>
        <p className='mb-1 text-xs'>
          Added by: {!loading ? siteCreatedBy : 'Fetching user...'}
        </p>
        <p className='text-xs'>
          Lat: {lat} Lng: {lng}
        </p>
      </div>
      <div className='site__actions mt-3 inline-flex items-center gap-x-5'>
        <ViewSiteButton site={siteId} />
        {isAuthenticated && account && owner === account ? (
          <>
            <EditSiteButton site={siteId} />
            <DeleteSiteButton site={siteId} />
          </>
        ) : undefined}
      </div>
    </div>
  )
}
