import type { ReactElement } from 'react'
import { lazy, Suspense } from 'react'

import { Footer, Header, LoadingOrError } from '@archly/components'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { initThinBackend } from 'thin-backend'
import { ThinBackend } from 'thin-backend-react'

const Home = lazy(async () => import('@archly/pages/Home'))
const Sites = lazy(async () => import('@archly/pages/Sites'))
const SiteDetail = lazy(async () => import('@archly/pages/SiteDetail'))
const About = lazy(async () => import('@archly/pages/About'))

initThinBackend({ host: import.meta.env.VITE_BACKEND_URL as string })

export default function App(): ReactElement {
  return (
    <Router>
      <Suspense fallback={<LoadingOrError />}>
        <ThinBackend>
          <Header />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/sites' element={<Sites />} />
            <Route path='/about' element={<About />} />
            <Route path=':siteId' element={<SiteDetail />} />
          </Routes>
          <Footer />
        </ThinBackend>
      </Suspense>
    </Router>
  )
}
