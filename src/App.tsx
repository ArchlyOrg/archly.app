import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'

import { Footer, Header, LoadingOrError } from '@archly/components'
import { Route, Routes } from 'react-router-dom'

const Home = lazy(async () => import('@archly/routes/Home'))
const Sites = lazy(async () => import('@archly/routes/Sites'))
const SiteDetail = lazy(async () => import('@archly/routes/site/SiteDetail'))
const About = lazy(async () => import('@archly/routes/About'))

export default function App(): ReactElement {
  return (
    <Suspense fallback={<LoadingOrError />}>
      <Header />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/sites' element={<Sites />} />
        <Route path='/about' element={<About />} />
        <Route path='/site/:siteId' element={<SiteDetail />} />
      </Routes>
      <Footer />
    </Suspense>
  )
}
