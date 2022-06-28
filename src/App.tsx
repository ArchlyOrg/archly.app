import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'

import { Footer, Header, LoadingOrError } from '@archly/components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'

// const Gallery = lazy(async () => import('@archly/pages/Gallery'))
// const Details = lazy(async () => import('@archly/pages/Details'))
const Home = lazy(async () => import('@archly/pages/Home'))
const Sites = lazy(async () => import('@archly/pages/Sites'))
const SiteDetail = lazy(async () => import('@archly/pages/SiteDetail'))

export default function App(): ReactElement {
  return (
    <Router>
      <Suspense fallback={<LoadingOrError />}>
        <Header />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/sites' element={<Sites />} />
          <Route path=':siteId' element={<SiteDetail />} />
        </Routes>
        <Footer />
      </Suspense>
    </Router>
  )
}
