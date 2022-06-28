import { RouterLink, UserStatus, UserTools } from '@archly/components'
import { MdAddLocationAlt } from 'react-icons/md'
import { useIsLoggedIn } from 'thin-backend-react'

function Header(): JSX.Element {
  const isLoggedIn = useIsLoggedIn()

  return (
    <header className='fixed top-0 left-0 z-[1000] w-full'>
      <div className='flex columns-3 content-center items-center justify-between px-10 py-3'>
        <div className='inline-flex'>
          <span className='text-xl font-black text-green-100'>Archly</span>
          <MdAddLocationAlt className='text-xl text-green-100' name='logo' />
        </div>
        <menu className='none [a: text-green-100] w-auto items-center justify-center space-x-8 px-0 font-bold lg:flex'>
          <RouterLink href='/'>Home</RouterLink>
          <RouterLink href='/sites'>Sites</RouterLink>
          <RouterLink href='/about'>About</RouterLink>
        </menu>
        <div className='flex-0 w-25 flex space-x-3'>
          <UserTools isLoggedIn={isLoggedIn} />
          <UserStatus />
        </div>
      </div>
    </header>
  )
}

export default Header
