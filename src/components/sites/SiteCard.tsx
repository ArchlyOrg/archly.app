import { useCallback, useEffect, useState } from 'react'

import {
  DeleteSiteButton,
  EditSiteButton,
  ViewSiteButton
} from '@archly/components'
import type { Site } from '@archly/types'
import { useMoralis } from 'react-moralis'

interface SiteCardProperties {
  site: Site
}

export default function SiteCard({ site }: SiteCardProperties): JSX.Element {
  const { Moralis, isAuthenticated, account } = useMoralis()
  const [siteCreatedBy, setSiteCreatedBy] = useState<string | undefined>()
  const { lat, lng, description, name, location, owner, siteId } = site
  const [loading, setLoading] = useState(false)

  const fetchSiteUser = useCallback(async (): Promise<string | undefined> => {
    try {
      setLoading(true)
      const User = Moralis.Object.extend('_User') as string
      const query = new Moralis.Query(User)
      query.equalTo('ethAddress', owner.toLowerCase())
      const result = await query.first()
      console.log('siteuser result:', result)

      if (result) {
        setSiteCreatedBy(result.attributes.displayName as string)
        setLoading(false)
        return result.attributes.username as string
      }
      setLoading(false)
      return undefined
    } catch (error) {
      console.log('error:', error)

      return undefined
    }
  }, [Moralis.Object, Moralis.Query, owner])

  useEffect(() => {
    if (siteCreatedBy === undefined) {
      fetchSiteUser()
        .then(result => {
          // console.log('result:', result)
          setSiteCreatedBy(result)
        })
        .catch(error => {
          console.log('error:', error)
        })
    }
  }, [fetchSiteUser, siteCreatedBy])

  return (
    <div className='site-card'>
      <div className='site-card__content font-medium'>
        <h3 className='mb-0 text-2xl font-black text-blue-200'>{name}</h3>
        <p className='mb-1 text-lg'>{description}</p>
        <p className='mb-1 text-xs'>{location}</p>
        <p className='mb-1 text-xs'>
          Added by: {!loading ? siteCreatedBy : 'Fetching user...'}
        </p>
        <p className='text-xs'>
          Lat: {lat} Lng: {lng}
        </p>
      </div>
      {isAuthenticated && account && owner === account ? (
        <div className='site__actions mt-3 inline-flex items-center gap-x-5'>
          <ViewSiteButton
            site={siteId}
            properties={{ size: 'lg', color: 'ghost' }}
          />
          <EditSiteButton
            site={siteId}
            properties={{ size: 'lg', variant: 'outline', color: 'ghost' }}
          />
          <DeleteSiteButton
            site={siteId}
            properties={{ size: 'lg', color: 'ghost' }}
          />
        </div>
      ) : undefined}
    </div>
  )
}
