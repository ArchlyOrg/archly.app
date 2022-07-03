/* eslint-disable react/jsx-handler-names */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-alert */
/* eslint-disable no-console */
import { useState } from 'react'

import { NewSiteDrawer } from '@archly/components'
import sitesAbi from '@archly/contracts/abi.json'
import type { NewSiteValues } from '@archly/types'
import {
  initialNewSiteValues,
  sitesContractAddress
} from '@archly/utils/constants'
import type { UseDarkModeType } from '@archly/utils/hooks'
import { useDarkMode } from '@archly/utils/hooks'
import type { ButtonProps } from 'react-daisyui'
import { Button } from 'react-daisyui'
import {
  MdAddLocationAlt,
  MdDarkMode,
  MdDelete,
  MdEditLocationAlt,
  MdLightMode,
  MdLocationPin
} from 'react-icons/md'
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from 'react-moralis'
import { useNavigate } from 'react-router-dom'
import usePortal from 'react-useportal'
import { deleteRecord, getCurrentUserId, updateRecord } from 'thin-backend'
import { useNotification } from 'web3uikit'
import type { TIconType } from 'web3uikit/dist/components/Icon/collection'
import type {
  IPosition,
  notifyType
} from 'web3uikit/dist/components/Notification/types'

/**
 * NewSiteButton
 *
 * Allows a logged in user to create a new site.
 *
 * TODO: Move the data input to a form component.
 * TODO: Add wikipedia lookup for the wikiUrl
 *
 * @param properties - The DaisyUI `ButtonProps` to pass to the Button
 * @returns JSX.Element
 */
export function NewSiteButton(): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { ref, openPortal, closePortal, isOpen, Portal } = usePortal({
    bindTo: document.querySelector('#portal-root') as HTMLElement
  })
  const [formData, setFormData] = useState<NewSiteValues>(initialNewSiteValues)
  const dispatch = useNotification()
  const { native } = useMoralisWeb3Api()
  const [isLoading, setIsLoading] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)

  const handleNewNotification = (
    type: notifyType,
    icon?: TIconType,
    position?: IPosition,
    message?: string,
    title?: string
  ): void => {
    dispatch({
      type,
      title,
      icon,
      position: position ?? 'topR',
      message
    })
  }

  const options = {
    chain: 'mumbai' as unknown as 'mumbai',
    address: sitesContractAddress,
    function_name: 'addSite',
    abi: sitesAbi,
    params: {
      formData
    },
    msgValue: 0
  }
  const {
    fetch: moralisFetch,
    data: moralisData,
    error: moralisError,
    isLoading: moralisIsLoading
  } = useMoralisWeb3ApiCall(native.runContractFunction, { ...options })

  const onToggleVisible = (): void => {
    setDrawerVisible(!drawerVisible)
    if (drawerVisible || isOpen) {
      closePortal()
    } else {
      openPortal()
    }
  }

  return (
    <>
      <Button
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ref={ref}
        aria-label='Add new site'
        onClick={onToggleVisible}
        disabled={isLoading}
        variant='link'
        color='ghost'
      >
        <MdAddLocationAlt className='text-3xl text-green-600 transition-colors delay-200 duration-300 ease-in-out dark:text-blue-400' />
      </Button>
      <Portal>
        <NewSiteDrawer
          drawerVisible={drawerVisible}
          setDrawerVisible={setDrawerVisible}
        />
      </Portal>
    </>
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
      className='shadow-sm shadow-black'
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
      className='shadow-sm shadow-black'
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
      className='shadow-sm shadow-black'
    />
  )
}

/**
 * DarkModeButton - *Toggle Dark Mode*
 *
 * Allows a user to toggle Dark Mode.
 *
 * @param properties - The DaisyUI `ButtonProps` to pass to the button
 * @returns JSX.Element
 */
export interface DarkModeButtonProperties extends ButtonProps {
  properties: ButtonProps
}

export function DarkModeButton(): JSX.Element {
  const { theme, toggleTheme }: UseDarkModeType = useDarkMode()
  const isDark: boolean = theme === 'dark'
  const onHandleClick = (): void => toggleTheme()
  const ModeIcon = isDark ? MdDarkMode : MdLightMode
  return (
    <Button
      aria-label='Toggle dark/light mode'
      onClick={onHandleClick}
      color='ghost'
      className=''
    >
      <ModeIcon className='text-shadow text-3xl text-green-600 shadow-black transition-colors delay-200 duration-300 ease-in-out dark:text-blue-400' />
    </Button>
  )
}
