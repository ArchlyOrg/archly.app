import { useCallback, useEffect, useRef, useState } from 'react'

import { LoadingOrError, SiteMap } from '@archly/components'
import type { Site } from '@archly/types'
import { copyText, shortenAddress } from '@archly/utils/helpers'
import { Badge, Button, Drawer, Tooltip } from 'react-daisyui'
import { FaCopy, FaExternalLinkAlt, FaUserCircle } from 'react-icons/fa'
import { HiFingerPrint, HiFire } from 'react-icons/hi'
import { MdLocationOn } from 'react-icons/md'
import { useMoralis } from 'react-moralis'
import { useParams } from 'react-router-dom'

const side = (
  <ul className='menu w-80 overflow-y-auto bg-base-200 p-4'>
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
        <Button onClick={onOpen} className='btn drawer-button btn-primary'>
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
  const { Moralis } = useMoralis()
  const { siteId } = useParams()

  // const {description} = site;
  const [loading, setLoading] = useState(false)
  const [currentSite, setCurrentSite] = useState<Site | undefined>()
  const siteCoords = useRef<{ lat: number; lng: number } | undefined>()
  // const isLoggedIn = useIsLoggedIn()

  const [currentCoords, setCurrentCoords] =
    useState<google.maps.LatLngLiteral>()
  const wrapper = useRef<HTMLDivElement>(null)
  const getCurrentSite = useCallback(async (): Promise<
    Error | Site | undefined
  > => {
    // console.log('Fetching site...')
    try {
      setLoading(true)
      const Sites = Moralis.Object.extend('SitesThirdWeb') as string
      const query = new Moralis.Query(Sites)
      query.equalTo('objectId', siteId)

      let site = {}
      const result = await query.find()
      if (result.length > 0) {
        for (const element of result) {
          site = {
            ...site,
            ...element.attributes,
            siteId: element.id
          }
        }

        setCurrentSite(site as Site)
        setCurrentCoords({
          lat: Number.parseFloat(result[0].attributes.lat as string),
          lng: Number.parseFloat(result[0].attributes.lng as string)
        })
        setLoading(false)
        return site as Site
      }
      throw new Error('No site found')
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error', error)
      return undefined
    }
  }, [Moralis.Object, Moralis.Query, siteId])

  const onCopy = (): void => {
    // let copied: boolean

    if (siteCoords.current !== undefined) {
      const text = `${siteCoords.current.lat}  ${siteCoords.current.lng}`
      copyText(text)
    }
  }

  useEffect(() => {
    if (currentSite === undefined) {
      getCurrentSite()
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('site fetched & added', result?.name)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error:', error)
          setLoading(false)
        })
    }
  }, [currentSite, getCurrentSite])

  return (
    <div ref={wrapper}>
      <main className='flex w-screen flex-col flex-nowrap '>
        <section className='w-100 border-1 relative flex h-screen flex-col items-center justify-center'>
          <SiteMap centerCoords={currentCoords} />
          <div className='section__content relative mt-28 w-3/4'>
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
            currentSite !== undefined &&
            currentCoords !== undefined ? (
              <div className='relative flex w-3/4 flex-col'>
                <div className='mb-3 inline-flex items-center gap-x-0'>
                  <h1>{currentSite.name}</h1>
                </div>
                <div className='mb-2 inline-flex items-center gap-x-2'>
                  <div
                    className='dark:tooltip-ghost tooltip'
                    data-tip={
                      currentSite.owner
                        ? `${shortenAddress(
                            currentSite.owner
                          )} added this site.`
                        : 'This site was added by an unknown user. 😬'
                    }
                  >
                    <div className='badge badge-md'>
                      <FaUserCircle />
                      {shortenAddress(currentSite.owner)}
                    </div>
                  </div>
                  <Tooltip message='General location'>
                    <Badge className='badge inline-flex items-center gap-x-1'>
                      <MdLocationOn />
                      {currentSite.location}
                    </Badge>
                  </Tooltip>
                  <Tooltip message='Users visited'>
                    <Badge className='badge inline-flex items-center gap-x-1'>
                      <HiFingerPrint />
                      23
                    </Badge>
                  </Tooltip>
                  <Tooltip message='User likes'>
                    <Badge className='badge inline-flex items-center gap-x-1'>
                      <HiFire />
                      36
                    </Badge>
                  </Tooltip>
                </div>
                <div className='inline-flex items-center gap-x-2'>
                  <Tooltip message='Click me to copy lat/lng to clipboard'>
                    <Badge className='badge inline-flex items-center gap-x-1'>
                      <MdLocationOn />
                      Lat: {currentCoords.lat} Lng: {currentCoords.lng}
                      <FaCopy
                        aria-label='Select to copy lat/lng coordinates'
                        onClick={onCopy}
                      />
                    </Badge>
                  </Tooltip>
                  {currentSite.wikiUrl ? (
                    <Tooltip message='View on Wikipedia'>
                      <Badge className='badge'>
                        <a
                          href={currentSite.wikiUrl}
                          target='_blank'
                          rel='noopener noreferrer'
                        >
                          Wikipedia
                        </a>
                        <FaExternalLinkAlt className='text-xs' />
                      </Badge>
                    </Tooltip>
                  ) : undefined}
                </div>
                <p className='mt-5 font-bold text-white dark:text-white'>
                  {currentSite.description}
                </p>
                <div className='mt-5 inline-flex items-center gap-x-2'>
                  <Button>View Gallery</Button>
                </div>
              </div>
            ) : (
              <LoadingOrError />
            )}
          </div>
        </section>
      </main>
    </div>
  )
}
