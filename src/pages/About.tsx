import type { ReactElement } from 'react'
import { useRef } from 'react'

import { initThinBackend } from 'thin-backend'
// import { useCurrentUser } from 'thin-backend-react';

initThinBackend({ host: import.meta.env.VITE_BACKEND_URL as string })

export default function About(): ReactElement {
  // const user = useCurrentUser()
  const wrapper = useRef(null)
  // const bgImage2Xl = 'assets/backgrounds/poulnabrone-dolmen-2xl.jpg'
  // const bgImageXl = 'assets/backgrounds/poulnabrone-dolmen-xl.jpg'
  // const bgImageLg = 'assets/backgrounds/poulnabrone-dolmen-lg.jpg'

  return (
    <div ref={wrapper}>
      {/* <Head>
				<title>archly: About us</title>
				<meta
					name='description'
					content='archly: A social app for Archaeology nerds.'
				/>
				<link rel='icon' href='/favicon.ico' />
			</Head> */}
      <main className='flex-column w-100 flex-wrap'>
        <section className='w-100 border-1 relative h-screen content-center items-center justify-center bg-darkish'>
          <div
            className='
					section__overlay
					absolute
					top-0
					left-0
					right-0
					bottom-0
					z-0
					h-screen
					w-screen
					opacity-[0.2] '
          />
          {/* backgroundImage={{
							base: `url(${bgImageLg})`,
							xl: `url(${bgImageXl})`,
							'2xl': `url(${bgImage2Xl})`
						}}
						backgroundSize='cover'

					/> */}
          <div className='section__content z-10 w-1/4 max-w-3xl'>
            <h1>What is archly?</h1>
            <p>
              archly is a social app for Archaeology nerds. It&apos;s a place to
              learn, share your knowledge, find new sites to explore and share
              your discoveries.
            </p>
            <p>
              I started this project 8 years ago as a little side project to
              learn React and some other tech but abandoned it when life took
              over. Nearly a decade later, I am rebuilding it. Better, stronger
              and waaay more fun.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
