/* eslint-disable react/jsx-handler-names */
import type { Dispatch, SetStateAction } from 'react'

import { Drawer } from '@archly/components'
import sitesAbi from '@archly/contracts/abi.json'
import {
  initialNewSiteValues,
  sitesContractAddress
} from '@archly/utils/constants'
import { NewSiteValidationSchema } from '@archly/utils/validation'
import { Field, Form, Formik } from 'formik'
import { useMoralis } from 'react-moralis'
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
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { Portal } = usePortal({
    bindTo: document.querySelector('#portal-root') as HTMLElement,
    closeOnEsc: true,
    closeOnOutsideClick: true
  })
  const dispatch = useNotification()
  const { Moralis } = useMoralis()

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
              const options = {
                chain: 'mumbai' as unknown as 'mumbai',
                contractAddress: sitesContractAddress,
                functionName: 'addSite',
                abi: sitesAbi,
                params: {
                  name: data.siteName,
                  description: data.siteDescription,
                  location: data.siteLocation,
                  lat: data.siteLat,
                  lng: data.siteLng,
                  imgUrl: data.siteImgUrl,
                  wikiUrl: data.siteWikiUrl
                }
              }
              handleNewNotification(
                'info',
                'matic',
                'bottomR',
                `Please sign the transaction to add ${data.siteName}`,
                'Saving your site!'
              )

              try {
                const transaction = await Moralis.executeFunction(options)
                console.log('transaction', transaction)
                if (transaction.hash) {
                  console.log('transaction result', transaction)
                  handleNewNotification(
                    'info',
                    'matic',
                    'bottomR',
                    `Tx hash: ${transaction.hash as string}`,
                    'Transaction in progress!'
                  )
                }
                // if (!transaction.hash) {
                //   throw new Error("Tx failed. Check console for more info.");

                // }
                // eslint-disable-next-line @typescript-eslint/no-unsafe-call
                await transaction.wait(3)
                handleNewNotification(
                  'success',
                  'matic',
                  'bottomR',
                  `${data.siteName} added successfully!`,
                  'Site added!'
                )
              } catch (error) {
                // eslint-disable-next-line no-console
                console.log('transaction falied', error)
                const errorMessage = 'The addSite transaction failed'
                // if (error instanceof Error) {
                handleNewNotification(
                  'error' as unknown as 'error',
                  'info' as unknown as 'info',
                  'bottomR',
                  error.message as string,
                  'Error adding site'
                )
                // }
                console.log(errorMessage)
              }
            }}
          >
            {({
              errors,
              touched,
              isSubmitting,
              isValid,
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
                <div className='row btn-group form-control mb-0 flex w-full columns-2 flex-row justify-end'>
                  <input
                    type='reset'
                    className='btn btn-outline btn-error btn-sm mr-2 text-white'
                    value='Reset'
                  />
                  <button
                    type='submit'
                    className={`btn btn-sm ${
                      !isValid || isSubmitting
                        ? 'btn-disabled text-gray-600 line-through'
                        : 'btn-subtle'
                    }`}
                    // onClick={submitForm}
                    aria-disabled={!isValid || isSubmitting}
                  >
                    {isSubmitting ? 'Saving...' : 'Save'}
                  </button>
                </div>
                {/* <Portal>
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
                </Portal> */}
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </Drawer>
  )
}
export default NewSiteDrawer
