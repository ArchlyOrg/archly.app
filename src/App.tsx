import type { ReactElement } from 'react'
import { Suspense } from 'react'

import { Footer, Header, LoadingOrError } from '@archly/components'

import AnimatedRoutes from './components/AnimatedRoutes'

export default function App(): ReactElement {
  return (
    <Suspense fallback={<LoadingOrError />}>
      <Header />
      <AnimatedRoutes />
      <Footer />
    </Suspense>
  )
}
