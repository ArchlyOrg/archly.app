/* eslint-disable no-alert */
/* eslint-disable no-console */
// import { useQuery, useQuerySingleResult, useCurrentUser, useIsLoggedIn } from 'thin-backend/react';
import { useRef, useState } from 'react'

import type { ButtonProps } from 'react-daisyui'
import { Button } from 'react-daisyui'
import {
  MdAddLocationAlt,
  MdDelete,
  MdEditLocationAlt,
  MdLocationPin
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import {
  createRecord,
  deleteRecord,
  getCurrentUserId,
  updateRecord
} from 'thin-backend'

/**
 * NewSiteButton
 *
 * Allows a logged in user to create a new site.
 *
 * TODO: Move the data input to a form component.
 *
 * @param properties - The DaisyUI `ButtonProps` to pass to the Button
 * @returns JSX.Element
 */

export function NewSiteButton(properties: ButtonProps): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const { size } = properties
  const reference = useRef<HTMLButtonElement | null>(null)
  function onCreateSite(): void {
    setIsLoading(true)

    createRecord('sites', {
      name: window.prompt('Site title') ?? '',
      description: window.prompt('Description?') ?? '',
      location: window.prompt('Location?') ?? '',
      coords: '{ "lat": 51.697332, "lng": -2.304548 }',
      wikipediaUrl: window.prompt('Wikipedia URL?') ?? '',
      userId: getCurrentUserId(),
      media: '{}'
    })
      .then(() => {
        setIsLoading(false)
        if (reference.current) {
          reference.current.focus()
        }
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log('Error creating site:', error)
        setIsLoading(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Button
      ref={reference}
      endIcon={<MdAddLocationAlt />}
      aria-label='Add new site'
      onClick={onCreateSite}
      disabled={isLoading}
      variant='outline'
      size={size ?? 'md'}
      color='ghost'
      className='shadow-black shadow-sm'
      // {...properties}
    />
  )
}

export interface DeleteSiteButtonProperties {
  site: string
  properties: ButtonProps
}

/**
 * DeleteSiteButton
 *
 * Allows a logged in user to delete a site they added.
 *
 * @param site: string - The ID of the site to delete
 * @param properties: ButtonProps - The DaisyUI `ButtonProps` to pass to the Button component
 * @returns
 */

export function DeleteSiteButton({
  site,
  properties
}: DeleteSiteButtonProperties): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const { size } = properties
  // const navigate = useNavigate()
  let confirm = false

  function onDeleteSite(): void {
    if (!site) return

    console.log('Deleting site...', site)
    if (!confirm) {
      confirm = window.confirm('Are you sure you want to delete this site?')
    }
    setIsLoading(true)
    if (confirm) {
      deleteRecord('sites', site)
        .then(() => {
          console.log('Deleted site!', site)
          setIsLoading(false)
        })
        .catch(error => {
          console.error('Error deleting site!', error)
          setIsLoading(false)
        })
        .finally(() => {
          setIsLoading(false)
          if (confirm) {
            // eslint-disable-next-line no-console
            console.log('Deleted site', site)
          } else {
            // eslint-disable-next-line no-console
            console.log('Deletion cancelled')
          }
        })
    }
  }

  return (
    <Button
      endIcon={<MdDelete />}
      aria-label='Delete this site'
      onClick={onDeleteSite}
      disabled={isLoading}
      variant='outline'
      size={size ?? 'md'}
      color='ghost'
      className='shadow-black shadow-sm'
    />
  )
}
export interface EditSiteButtonProperties {
  site: string
  properties: ButtonProps
}

/**
 * EditSiteButton - *Edit a site*
 *
 * Allows a logged in user to edit a site that they have created.
 *
 * TODO: Maybe add in a check for the user being logged in - should it be in the button logic?
 *
 * @param site - The site to edit (the ID)
 * @param properties - The DaisyUI `ButtonProps` to pass to the button
 *
 * @returns JSX.Element
 */
export function EditSiteButton({
  site,
  properties
}: EditSiteButtonProperties): JSX.Element {
  const [isLoading, setIsLoading] = useState(false)
  const { size } = properties
  function onEditSite(): void {
    if (!site) return
    setIsLoading(true)
    // eslint-disable-next-line no-console
    console.log('Editing site...', site)

    updateRecord('sites', site, {
      name: window.prompt('Site title') ?? '',
      description: window.prompt('Description?') ?? '',
      location: window.prompt('Location?') ?? '',
      coords: '{ "lat": 51.697332, "lng": -2.304548 }',
      userId: getCurrentUserId(),
      media: '{}'
    })
      .then(() => {
        // eslint-disable-next-line no-console
        console.log('Edited site!', site)
        setIsLoading(false)
      })
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error editing site!', error)
        setIsLoading(false)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  return (
    <Button
      endIcon={<MdEditLocationAlt />}
      aria-label='Edit site'
      onClick={onEditSite}
      disabled={isLoading}
      variant='outline'
      size={size ?? 'md'}
      color='ghost'
      className='shadow-black shadow-sm'
    />
  )
}

export interface ViewSiteButtonProperties {
  site: string
  properties: ButtonProps
}

/**
 * ViewSiteButton - *View a site*
 *
 * Allows any user to view a site.
 *
 * @param site - The site to view (the ID)
 * @param properties - The DaisyUI `ButtonProps` to pass to the button
 * @returns JSX.Element
 */

export function ViewSiteButton({
  site,
  properties
}: ViewSiteButtonProperties): JSX.Element {
  const { size } = properties
  const navigate = useNavigate()

  const onHandleClick = (): void => {
    navigate(`/sites/${site}`)
  }

  return (
    <Button
      endIcon={<MdLocationPin />}
      aria-label='View this site'
      onClick={onHandleClick}
      variant='outline'
      size={size ?? 'md'}
      color='ghost'
      className='shadow-black shadow-sm'
    />
  )
}
