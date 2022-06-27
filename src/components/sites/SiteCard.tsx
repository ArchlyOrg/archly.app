import type { Site } from 'thin-backend'
import { query } from 'thin-backend'
import { useCurrentUser, useQuerySingleResult } from 'thin-backend-react'

import {
  DeleteSiteButton,
  EditSiteButton,
  ViewSiteButton
} from '@archly/components'

interface SiteCardProperties {
  site: Site
}

export default function SiteCard({ site }: SiteCardProperties): JSX.Element {
  const { lat, lng } = JSON.parse(
    site.coords
  ) as google.maps.LatLngAltitudeLiteral
  const creator = useQuerySingleResult(query('users').where('id', site.userId))
  const user = useCurrentUser()

  return (
    <div>
      <h3>{site.name}</h3>
      <p>{site.description}</p>
      <p>{site.location}</p>
      <p>Added by: {creator ? creator.username : undefined}</p>
      <p>
        Lat: {lat} Lng: {lng}
      </p>
      {user && site.userId === user.id ? (
        <div className='site__actions inline-flex items-center gap-x-0'>
          <EditSiteButton site={site.id} />
          <DeleteSiteButton site={site.id} />
          <ViewSiteButton site={site.id} />
        </div>
      ) : undefined}
    </div>
  )
}
