import { useCallback, useEffect, useRef, useState } from 'react'

import { HeroMap, SitesList } from '@archly/components'
import type { Site } from '@archly/types'
import { useMoralis } from 'react-moralis'

export default function HomePage(): JSX.Element {
  const { Moralis } = useMoralis()
  const wrapper = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(false)
  const [primarySite, setPrimarySite] = useState<Site | undefined>()

  const getPrimarySite = useCallback(async (): Promise<Site | undefined> => {
    try {
      setLoading(true)
      const Sites = Moralis.Object.extend('Sites') as string
      const query = new Moralis.Query(Sites)
      query.equalTo('primarySite', true)
      let site = {}
      const result = await query.find()
      for (const element of result) {
        site = {
          ...site,
          ...element.attributes,
          siteId: element.id
        }
      }
      setPrimarySite(site as Site)
      setLoading(false)
      return result[0].attributes as Site
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('error:', error)
      return undefined
    }
  }, [Moralis.Object, Moralis.Query])

  useEffect(() => {
    if (primarySite === undefined) {
      getPrimarySite()
        .then(result => {
          // eslint-disable-next-line no-console
          console.log('result', result)
        })
        .catch(error => {
          // eslint-disable-next-line no-console
          console.log('error:', error)
          setLoading(false)
        })
    }
  }, [primarySite, getPrimarySite])

  return (
    <main ref={wrapper} className='w-100 flex-col flex-wrap'>
      <section
        id='home'
        className='w-100 relative flex h-screen flex-col content-center items-center justify-center'
      >
        <HeroMap site={primarySite} />
        <div className='section__content  relative mt-28 max-w-screen-2xl text-center'>
          <h1>Archly</h1>
          <p>The Social App for Archaeology Nerds.</p>
          {loading ? <p>Loading map...</p> : ''}
        </div>
      </section>
      <section className='w-100 relative flex h-screen flex-col content-center items-center  justify-center '>
        <div className='section__content w-3/4'>
          <SitesList />
        </div>
      </section>
    </main>
  )
}
