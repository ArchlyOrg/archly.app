/* eslint-disable import/prefer-default-export */
import * as Yup from 'yup'

export const NewSiteValidationSchema = Yup.object().shape({
  siteName: Yup.string()
    // eslint-disable-next-line @typescript-eslint/no-magic-numbers
    .min(2, 'Site name must be at least 2 characters long')
    .required('Name is required'),
  siteDescription: Yup.string().required('Description is required'),
  siteLocation: Yup.string().required('Location is required'),
  siteLat: Yup.string().required('Latitude is required'),
  siteLng: Yup.string().required('Longitude is required'),
  siteImgUrl: Yup.string()
    .url('Image URL must be a valid URL')
    .required('Image URL is required'),
  siteWikiUrl: Yup.string()
    .url('Wiki URL must be a valid URL')
    .required('Wikipedia URL is required')
})
