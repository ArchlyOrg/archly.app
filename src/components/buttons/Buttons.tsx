/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable no-alert */
/* eslint-disable no-console */
// import { useQuery, useQuerySingleResult, useCurrentUser, useIsLoggedIn } from 'thin-backend/react';
import { useState } from 'react'

import { Drawer } from '@archly/components'
import type { Site } from '@archly/types'
import type { UseDarkModeType } from '@archly/utils/hooks'
import { useDarkMode } from '@archly/utils/hooks'
import type { FormikHelpers } from 'formik'
import { Field, Formik } from 'formik'
import type { ButtonProps } from 'react-daisyui'
import { Button, Form } from 'react-daisyui'
import {
  MdAddLocationAlt,
  MdDarkMode,
  MdDelete,
  MdEditLocationAlt,
  MdLightMode,
  MdLocationPin
} from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import usePortal from 'react-useportal'
import { deleteRecord, getCurrentUserId, updateRecord } from 'thin-backend'
import * as Yup from 'yup'

const NewSiteValidationSchema = Yup.object().shape({
  siteName: Yup.string().required('Name is required'),
  siteDescription: Yup.string().required('Description is required'),
  siteLocation: Yup.string().required('Location is required'),
  siteLat: Yup.number().required('Latitude is required'),
  siteLng: Yup.number().required('Longitude is required'),
  siteImgUrl: Yup.string().required('Image URL is required'),
  siteWikiUrl: Yup.string().required('Wikipedia URL is required')
})
export interface NewSiteValues {
  siteName: Site['name']
  siteDescription: Site['description']
  siteLocation: Site['location']
  siteLat: Site['lat']
  siteLng: Site['lng']
  siteImgUrl: Site['imgUrl']
  siteWikiUrl: Site['wikiUrl']
}
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
  const [isLoading, setIsLoading] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const timeout = 500
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
        <Drawer isOpen={drawerVisible} setIsOpen={setDrawerVisible}>
          <div className='relative z-20 h-full w-full text-left '>
            <h3 className=' mb-0 text-2xl font-bold text-gray-700 dark:text-blue-200'>
              Add new site
            </h3>
            <p className='text-md mb-3 text-blue-100'>
              Add all the info for a new site.
            </p>
            <div className='flex w-full flex-col items-start justify-start'>
              <Formik
                initialValues={
                  {
                    siteName: '',
                    siteDescription: '',
                    siteLocation: '',
                    siteLat: '',
                    siteLng: '',
                    siteImgUrl: '',
                    siteWikiUrl: ''
                  } as NewSiteValues
                }
                validationSchema={NewSiteValidationSchema}
                // eslint-disable-next-line react/jsx-handler-names
                onSubmit={(
                  values: NewSiteValues,
                  { setSubmitting }: FormikHelpers<NewSiteValues>
                ): void => {
                  setTimeout(() => {
                    alert(JSON.stringify(values, undefined, 2))
                    setSubmitting(false)
                  }, timeout)
                }}
              >
                {({ errors, touched, isSubmitting }): JSX.Element => (
                  <Form>
                    <div className='form-control mb-3 w-full'>
                      <label
                        htmlFor='siteName'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Name
                        </span>
                        <Field
                          id='siteName'
                          name='siteName'
                          component='input'
                          type='text'
                          placeholder='Site name'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteName && touched.siteName ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteName}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Enter the site name
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='form-control mb-3 w-full'>
                      <label
                        htmlFor='siteDescription'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Description
                        </span>

                        <Field
                          id='siteDescription'
                          name='siteDescription'
                          component='input'
                          type='text'
                          placeholder='Description'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteDescription && touched.siteDescription ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteDescription}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Enter a description
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='form-control mb-3 w-full'>
                      <label
                        htmlFor='siteLocation'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Location
                        </span>
                        <Field
                          id='siteLocation'
                          name='siteLocation'
                          component='input'
                          type='text'
                          placeholder='Location'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteLocation && touched.siteLocation ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteLocation}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Enter the location of the site.
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='form-control mb-3 w-full '>
                      <label
                        htmlFor='siteLat'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Latitude
                        </span>

                        <Field
                          id='siteLat'
                          name='siteLat'
                          component='input'
                          type='text'
                          placeholder='Latitude'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteLat && touched.siteLat ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteLat}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Enter the latitude of the site.
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='form-control mb-3 w-full'>
                      <label
                        htmlFor='siteLng'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Longitude
                        </span>

                        <Field
                          id='siteLng'
                          name='siteLng'
                          component='input'
                          type='text'
                          placeholder='Longitude'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteLng && touched.siteLng ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteLng}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Enter the longitude of the site.
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='form-control mb-3 w-full'>
                      <label
                        htmlFor='siteImgUrl'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Image URL
                        </span>

                        <Field
                          id='siteImgUrl'
                          name='siteImgUrl'
                          component='input'
                          type='text'
                          placeholder='Image URL'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteImgUrl && touched.siteImgUrl ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteImgUrl}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Paste the image URL or upload a new image.
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='form-control mb-3 w-full max-w-md'>
                      <label
                        htmlFor='siteWikiUrl'
                        className='label flex flex-col content-start items-start justify-start text-left '
                      >
                        <span className='label-text hidden text-left font-bold text-blue-200'>
                          Wikipedia URL
                        </span>

                        <Field
                          id='siteWikiUrl'
                          name='siteWikiUrl'
                          component='input'
                          type='text'
                          placeholder='Wikipedia URL'
                          className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600'
                        />
                        <span className='label'>
                          {errors.siteWikiUrl && touched.siteWikiUrl ? (
                            <span className='label-text-alt text-error'>
                              {errors.siteWikiUrl}
                            </span>
                          ) : (
                            <span className='label-text-alt text-green-300'>
                              Enter a Wikipedia URL for the site.
                            </span>
                          )}
                        </span>
                      </label>
                    </div>
                    <div className='row form-control mb-0 flex w-full columns-2 flex-row justify-end'>
                      <input
                        type='reset'
                        className='btn btn-error btn-sm mr-2'
                        value='Reset'
                      />
                      <button type='submit' className='btn-subtle btn btn-sm'>
                        Save
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </Drawer>
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
