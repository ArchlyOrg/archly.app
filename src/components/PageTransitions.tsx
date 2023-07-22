/* eslint-disable unicorn/no-null */
import type { ReactNode } from 'react'
import { useEffect, useRef } from 'react'

import '@archly/styles/PageTransitions.css'
import { CSSTransition, TransitionGroup } from 'react-transition-group'

interface MainComponentProperties {
  routingPageOffset: number
  children: ReactNode
}
function MainComponent({
  routingPageOffset,
  children
}: MainComponentProperties): JSX.Element {
  const mainComponentReference = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (mainComponentReference.current) {
      const mainElement = mainComponentReference.current.querySelector('main')
      if (mainElement) {
        mainElement.style.transform = `translateX(${routingPageOffset}px)`
      }
    }
  }, [mainComponentReference, routingPageOffset])
  return (
    <div ref={mainComponentReference} className='main-component relative'>
      {children}
    </div>
  )
}

function WipeTransition(): JSX.Element {
  const wipeElementReference = useRef<HTMLDivElement>(null)
  return (
    <div
      ref={wipeElementReference}
      className='
			wipe
			fixed
			top-0
			left-0
			z-20
			h-screen
			w-full
			translate-y-full
			bg-gray-700'
    />
  )
}

interface PageTransitionsProperties {
  children: ReactNode
  route: string
  routingPageOffset: number
}
function PageTransitions({
  children,
  route,
  routingPageOffset
}: PageTransitionsProperties): JSX.Element {
  // const [inProperty, setInProperty] = useState(false)
  // const reference = useRef<HTMLDivElement>(null)

  return (
    <>
      <TransitionGroup component={null}>
        <CSSTransition key={route} classNames='page' timeout={600}>
          <MainComponent routingPageOffset={routingPageOffset}>
            {children}
          </MainComponent>
        </CSSTransition>
      </TransitionGroup>
      <WipeTransition />
    </>
  )
}

export default PageTransitions
