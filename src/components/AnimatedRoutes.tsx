import { lazy, useEffect, useState } from 'react'

import { Route, Routes, useLocation } from 'react-router-dom'

const Home = lazy(async () => import('@archly/routes/Home'))
const Sites = lazy(async () => import('@archly/routes/Sites'))
const SiteDetail = lazy(async () => import('@archly/routes/site/SiteDetail'))
const About = lazy(async () => import('@archly/routes/About'))

export default function AnimatedRoutes(): JSX.Element {
  const location = useLocation()
  const [routingPageOffset, setRoutingPageOffset] = useState(0)

  useEffect(() => {
    // const pageChange = (): void => {
    // }

    if (typeof window !== 'undefined') {
      setRoutingPageOffset(window.scrollY)
    }
  }, [location])

  return (
    // <PageTransitions
    //   route={location.pathname}
    //   routingPageOffset={routingPageOffset}
    // >
    <Routes location={location} key={location.pathname}>
      <Route path='/' element={<Home />} />
      <Route path='/sites' element={<Sites />} />
      <Route path='/about' element={<About />} />
      <Route path='/site/:siteId' element={<SiteDetail />} />
    </Routes>
    // </PageTransitions>
  )
}
