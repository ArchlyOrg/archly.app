import type { ReactElement } from 'react'
import { useRef } from 'react'

export default function About(): ReactElement {
  // const user = useCurrentUser()
  const wrapper = useRef(null)

  return (
    <main ref={wrapper} className='flex-column w-100 flex-wrap'>
      <section className='w-100 border-1 relative flex h-screen flex-col content-center items-center justify-center bg-darkish'>
        <div
          className={`
          section__overlay
          absolute
          top-0
          left-0
          right-0
          bottom-0
          z-0
          h-screen
          w-screen
          bg-[url('/assets/backgrounds/poulnabrone-dolmen-lg.jpg')]
          bg-cover
          opacity-[0.2]
          xl:bg-[url('/assets/backgrounds/poulnabrone-dolmen-xl.jpg')]
          2xl:bg-[url('/assets/backgrounds/poulnabrone-dolmen-2xl.jpg')]
          `}
        />
        <div className='section__content z-10 w-3/4 max-w-3xl'>
          <h1>What is archly?</h1>
          <p>
            archly is a social app for Archaeology nerds. It&apos;s a place to
            learn, share your knowledge, find new sites to explore and share
            your discoveries.
          </p>
          <p>
            I started this project 8 years ago as a little side project to learn
            React and some other tech but abandoned it when life took over.
            Nearly a decade later, I am rebuilding it. Better, stronger and
            waaay more fun.
          </p>
        </div>
      </section>
    </main>
  )
}
