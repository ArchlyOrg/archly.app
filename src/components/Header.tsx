import { RouterLink, UserStatus, UserTools } from '@archly/components'
import { MdAddLocationAlt } from 'react-icons/md'
import { useMoralis } from 'react-moralis'

function Header(): JSX.Element {
  const { isAuthenticated } = useMoralis()

  return (
    <>
      <header className='fixed top-0 left-0 z-[100] w-full'>
        <div className='flex columns-3 content-center items-center justify-between px-10 py-3'>
          <div className='w-1/4 justify-start'>
            <div className='inline-flex'>
              <span className='text-xl font-black text-green-600 transition-colors  duration-200 ease-in-out dark:text-green-100'>
                Archly
              </span>
              <MdAddLocationAlt
                className='text-xl text-green-600 transition-colors duration-200 ease-in-out dark:text-green-100'
                name='logo'
              />
            </div>
          </div>
          <menu className='none [a: text-green-100] w-auto items-center justify-center space-x-8 px-0 font-bold lg:flex'>
            <RouterLink href='/'>Home</RouterLink>
            <RouterLink href='/sites'>Sites</RouterLink>
            <RouterLink href='/about'>About</RouterLink>
          </menu>
          <div className='flex-0 space-l-3 flex w-1/4 justify-end'>
            <UserTools isLoggedIn={isAuthenticated} />
            <UserStatus />
          </div>
        </div>
      </header>
      <div className='pointer-events-none fixed top-0 left-0 z-10 h-screen w-full bg-gradient-to-b from-green-100  opacity-5 dark:from-green-900' />
    </>
  )
}

export default Header
