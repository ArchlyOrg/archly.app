import type { ReactElement } from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'

import { MapMarker, SiteMap } from '@archly/components'
import { mapsApiKey } from '@archly/utils/constants'
import { copyText } from '@archly/utils/helpers'
import { Status, Wrapper } from '@googlemaps/react-wrapper'
import { Badge, Button, Drawer, Tooltip } from 'react-daisyui'
import {
  FaCopy,
  FaExternalLinkAlt,
  FaSpinner,
  FaUserCircle
} from 'react-icons/fa'
import { HiFingerPrint, HiFire } from 'react-icons/hi'
import { MdLocationOn } from 'react-icons/md'
import { Link, useParams } from 'react-router-dom'
import type { Site } from 'thin-backend'
import { initThinBackend, query } from 'thin-backend'
import { useQuerySingleResult } from 'thin-backend-react'


initThinBackend({ host: process.env.NEXT_PUBLIC_BACKEND_URL })

const render = (status: Status): ReactElement => {
  switch (status) {
    case Status.LOADING:
      return <FaSpinner fontSize='2xl' color='green' />
    case Status.FAILURE:
      return <p>Error: Couldn&apos;t load map</p>
    case Status.SUCCESS:
      return <SiteMap />
    default:
      return <p>Unkown status</p>
  }
}

const side = (
  <ul className='menu bg-base-200 w-80 overflow-y-auto p-4'>
    <li>
      <a href='/'>Sidebar Item 1</a>
    </li>
    <li>
      <a href='/'>Sidebar Item 2</a>
    </li>
  </ul>
)

interface InfoDrawerProperties {
  site: Site | null
}
export function InfoDrawer({ site }: InfoDrawerProperties): JSX.Element {
  const buttonReference = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>()

  const onOpen = (): void => {
    if (buttonReference.current) {
      buttonReference.current.focus()
    }
    setIsOpen(!isOpen)
  }

  return (
    <Drawer
      id='sidebar-id'
      className='h-screen w-full'
      open={isOpen}
      side={side}
    >
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='flex w-full items-center justify-center'>
        <Button onClick={onOpen} className='btn btn-primary drawer-button'>
          More info
        </Button>
        <div>More info</div>
        <div>
          <div className='w-lg'>
            <p>{site?.description}</p>
          </div>
        </div>
      </div>
    </Drawer>
  )
}

export default function SiteDetail(): JSX.Element {
  // const navigate = useNavigate()
  const { siteId } = useParams()
  // console.log('siteId', siteId);

  // const {description} = site;
  const [loading, setLoading] = useState(true)
  const [currentSite, setCurrentSite] = useState<Site | undefined>()
  const siteCoords = useRef<{ lat: number; lng: number } | undefined>()
  // const isLoggedIn = useIsLoggedIn()
  const siteCreator = useQuerySingleResult(
    query('users').where('id', currentSite?.userId as string)
  )
  const [currentCoords, setCurrentCoords] = useState<
    google.maps.LatLngLiteral | undefined
  >()
  const wrapper = useRef<HTMLDivElement>(null)
  const getCurrentSite = useCallback(async () => {
    // console.log('Fetching site...')
    setLoading(true)
    try {
      const site = await query('sites')
        .where('id', siteId as string)
        .fetchOne()
      // const { id, name, description, coords, userId } = site;
      console.log('site', site)

      if (site.id === siteId && siteCoords.current !== undefined) {
        const coords = JSON.parse(site.coords) as google.maps.LatLngLiteral
        const parsed = {
          lat: coords.lat,
          lng: coords.lng
        }
        siteCoords.current = parsed

        setCurrentSite(site)
        setCurrentCoords(JSON.parse(site.coords) as google.maps.LatLngLiteral)
        setLoading(false)
        // console.log('current:', currentSite)
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error)
    }
  }, [setLoading, setCurrentSite, siteId])

  // getCurrentSite();

  const onCopy = (): void => {
    // let copied: boolean

    if (siteCoords.current !== undefined) {
      const text = `${siteCoords.current.lat}  ${siteCoords.current.lng}`

      copyText(text)

      // return true
    }
    // return false
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && !currentSite) {
      getCurrentSite()
        .then(() => {
          // console.log('current:', currentSite)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error', error)
        })
    }
  }, [currentSite, getCurrentSite])

  console.log('currentCoords:', currentCoords)

  return (
    <div ref={wrapper}>
      <main className='flex w-screen flex-col flex-nowrap '>
        <section>
          <div className='section__content w-100'>
            <Wrapper apiKey={mapsApiKey} render={render}>
              {!loading && currentCoords ? (
                <SiteMap centerCoords={currentCoords}>
                  <MapMarker
                    title={currentSite?.name}
                    key={currentSite?.id}
                    position={currentCoords}
                    visible
                  />
                </SiteMap>
              ) : undefined}
            </Wrapper>
            <div className='w-3xl relative mx-auto'>
              {/* maxW='3xl'
							sx={{
								'p:first-of-type': {
									fontSize: 'xl',
									lineHeight: { base: '1.7rem' },
									fontWeight: 700
								}
							}}
						> */}
              {!loading &&
              currentSite &&
              siteCreator &&
              siteCoords.current !== undefined ? (
                <>
                  <div className='mb-3 inline-flex items-center gap-x-0'>
                    <h1>{currentSite.name}</h1>
                  </div>
                  <div className='mb-2 inline-flex items-center gap-x-2'>
                    <Tooltip
                      message={
                        siteCreator.username
                          ? `${siteCreator.username} added this site.`
                          : 'This site was added by an unknown user. 😬'
                      }
                    >
                      <Badge className='tag' responsive>
                        <FaUserCircle />
                        {siteCreator.username}
                      </Badge>
                    </Tooltip>
                    <Tooltip message='General location'>
                      <Badge>
                        <MdLocationOn />
                        {currentSite.location}
                      </Badge>
                    </Tooltip>
                    <Tooltip message='Users visited'>
                      <Badge>
                        <HiFingerPrint />
                        23
                      </Badge>
                    </Tooltip>
                    <Tooltip message='User likes'>
                      <Badge>
                        <HiFire />
                        36
                      </Badge>
                    </Tooltip>
                  </div>
                  <div className='inline-flex items-center gap-x-2'>
                    <Tooltip message='Click me to copy lat/lng to clipboard'>
                      <Badge>
                        <MdLocationOn />
                        Lat: {siteCoords.current.lat} Lng:{' '}
                        {siteCoords.current.lng}
                        <FaCopy
                          aria-label='Select to copy lat/lng coordinates'
                          onClick={onCopy}
                        />
                      </Badge>
                    </Tooltip>
                    {currentSite.wikipediaUrl ? (
                      <Tooltip message='View on Wikipedia'>
                        <Badge>
                          <Link
                            to={currentSite.wikipediaUrl}
                            color='blue.700'
                            target='_blank'
                          >
                            Wikipedia{' '}
                            <FaExternalLinkAlt className='text-blue mx-2' />
                          </Link>
                        </Badge>
                      </Tooltip>
                    ) : undefined}
                  </div>
                  <p className='mt-5'>{currentSite.description}</p>
                  <div className='mt-5 inline-flex items-center gap-x-2'>
                    <InfoDrawer site={currentSite} />
                    <Button>View Gallery</Button>
                  </div>
                </>
              ) : undefined}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
