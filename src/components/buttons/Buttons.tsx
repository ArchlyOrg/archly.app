import {
  createRecord,
  getCurrentUserId,
  deleteRecord,
  updateRecord
} from 'thin-backend'
// import { useQuery, useQuerySingleResult, useCurrentUser, useIsLoggedIn } from 'thin-backend/react';
import { useRef, useState } from 'react'
import {
  MdAddLocationAlt,
  MdDelete,
  MdEditLocationAlt,
  MdLocationPin
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import { Button } from 'react-daisyui'
import type { ButtonProps } from 'react-daisyui'

export function NewSiteButton(properties: ButtonProps): JSX.Element {
  const [isLoading, setLoading] = useState(false)
  const { size } = properties
  const reference = useRef(null)
  async function onCreateSite(): Promise<void> {
    setLoading(true)

    try {
      await createRecord('sites', {
        name: window.prompt('Site title') || '',
        description: window.prompt('Description?') || '',
        location: window.prompt('Location?') || '',
        coords: '{ "lat": 51.697332, "lng": -2.304548 }',
        wikipediaUrl: window.prompt('Wikipedia URL?') || '',
        userId: getCurrentUserId(),
        media: '{}'
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      ref={reference}
      endIcon={<MdAddLocationAlt />}
      aria-label='Add new site'
      onClick={() => onCreateSite()}
      disabled={isLoading}
      variant='outline'
      size={size ?? 'md'}
      color='ghost'
      className='shadow-sm shadow-black'
      {...properties}
    />
  )
}

export interface DeleteSiteButtonProperties {
  site: string
}

export function DeleteSiteButton({ site }: DeleteSiteButtonProperties) {
  let confirm = false

  async function deleteSite() {
    if (!site) return

    console.log('Deleting site...', site)
    if (!confirm) {
      confirm = window.confirm('Are you sure you want to delete this site?')
    }
    try {
      if (confirm) {
        await deleteRecord('sites', site)
      }
    } finally {
      if (confirm) {
        console.log('Deleted site', site)
      } else {
        console.log('Deletion cancelled')
      }
    }
  }

  return (
    <IconButton
      icon={<MdDelete />}
      aria-label='Delete this site'
      onClick={deleteSite}
      colorScheme='ghost'
      fontSize='30px'
      color='green.500'
    />
  )
}
export interface EditSiteButtonProperties {
  site: string
}

export function EditSiteButton({ site }: EditSiteButtonProperties) {
  async function editSite() {
    if (!site) return

    console.log('Editing site...', site)

    try {
      await updateRecord('sites', site, {
        name: window.prompt('Site title') || '',
        description: window.prompt('Description?') || '',
        location: window.prompt('Location?') || '',
        coords: '{ "lat": 51.697332, "lng": -2.304548 }',
        userId: getCurrentUserId(),
        media: '{}'
      })
    } finally {
      console.log('Updated site', site)
    }
  }

  return (
    <IconButton
      icon={<MdEditLocationAlt />}
      aria-label='Edit site'
      onClick={editSite}
      colorScheme='ghost'
      fontSize='30px'
      color='green.500'
    />
  )
}

export interface ViewSiteButtonProperties {
  site: string
}

export function ViewSiteButton({ site }: ViewSiteButtonProperties) {
  const router = useRouter()

  const handleClick = () => {
    router.push({
      pathname: '/site/[siteId]',
      query: { siteId: site }
    })
  }

  return (
    <IconButton
      icon={<MdLocationPin />}
      aria-label='View this site'
      onClick={handleClick}
      colorScheme='ghost'
      fontSize='30px'
      color='green.500'
    />
  )
}
