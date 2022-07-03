/* eslint-disable react/jsx-handler-names */
import type { Dispatch, SetStateAction } from 'react'
import { useState } from 'react'

import { Drawer } from '@archly/components'
import sitesAbi from '@archly/contracts/abi.json'
import type { NewSiteValues } from '@archly/types'
import {
  initialNewSiteValues,
  sitesContractAddress
} from '@archly/utils/constants'
import { NewSiteValidationSchema } from '@archly/utils/validation'
import { Field, Form, Formik } from 'formik'
import { useMoralisWeb3Api, useMoralisWeb3ApiCall } from 'react-moralis'
import usePortal from 'react-useportal'
import { useNotification } from 'web3uikit'
import type { TIconType } from 'web3uikit/dist/components/Icon/collection'
import type {
  IPosition,
  notifyType
} from 'web3uikit/dist/components/Notification/types'

export interface NewSitePortalProperties {
  drawerVisible: boolean
  setDrawerVisible: Dispatch<SetStateAction<boolean>>
}
function NewSiteDrawer({
  drawerVisible,
  setDrawerVisible
}: NewSitePortalProperties): JSX.Element {
  const [formData, setFormData] = useState<NewSiteValues>(initialNewSiteValues)
  const { ref, openPortal, closePortal, isOpen, Portal } = usePortal({
    bindTo: document.querySelector('#portal-root') as HTMLElement
  })
  const dispatch = useNotification()
  const { native } = useMoralisWeb3Api()

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
  return (
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
            initialValues={initialNewSiteValues}
            validationSchema={NewSiteValidationSchema}
            // eslint-disable-next-line react/jsx-handler-names
            onSubmit={async (data, { setSubmitting }): Promise<void> => {
              setSubmitting(true)
              console.log('data', data)
              setFormData(data)
              try {
                await moralisFetch({
                  params: options
                })
                if (moralisData) {
                  console.log('moralisData', moralisData)
                  setSubmitting(false)
                }
                if (moralisError) {
                  setSubmitting(false)
                  throw new Error(moralisError.message)
                }
              } catch (error) {
                handleNewNotification(
                  'error' as unknown as 'error',
                  'info' as unknown as 'info',
                  'bottomR',
                  moralisError?.message.toString(),
                  'Error adding site'
                )
                console.log('error', error)

                setSubmitting(false)
              }
            }}
          >
            {({
              errors,
              touched,
              isSubmitting,
              isValid,
              submitForm,
              values
            }): JSX.Element => (
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
                      className='input input-ghost w-full max-w-xl text-xl placeholder:text-gray-600 invalid:border-red-500'
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
                      type='url'
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
                      type='url'
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
                  <button
                    type='submit'
                    className={`btn btn-sm ${
                      !isValid ? 'btn-disabled' : 'btn-subtle'
                    }`}
                    onClick={submitForm}
                    disabled={!isValid}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
                <Portal>
                  <div
                    className={`fixed bottom-8 left-8 z-50 rounded-md bg-darkish p-10 transition-all delay-200 duration-300 ${
                      drawerVisible ? 'opacity-100' : 'opacity-0'
                    }`}
                  >
                    <h4 className='text-green-200'>Form debug</h4>
                    <pre className=' text-sm text-green-200'>
                      {JSON.stringify(values, undefined, 2)}
                      <span className='block'>{`Form is...${
                        isValid ? 'Valid' : 'Invalid'
                      }`}</span>
                    </pre>
                  </div>
                </Portal>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>
  )
}
export default NewSiteDrawer
