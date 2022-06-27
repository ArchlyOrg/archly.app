import { NewSiteButton, RouterLink, UserStatus } from '@archly/components'
import { MdAddLocationAlt } from 'react-icons/md'
import { useIsLoggedIn } from 'thin-backend-react'

interface UserToolsProperties {
  isLoggedIn: boolean | null
}
export function UserTools({ isLoggedIn }: UserToolsProperties): JSX.Element {
  return (
    <div className='inline-flex'>
      {isLoggedIn ? <NewSiteButton aria-label='Add a new site.' /> : undefined}
    </div>
  )
}

function Header(): JSX.Element {
  const isLoggedIn = useIsLoggedIn()

  return (
    <header className='w-100 fixed top-0 left-0 z-[1000]'>
      <div className='flex content-center items-center justify-between px-10 py-3'>
        <div className='inline-flex'>
          <span className='weight-700 text-sm text-green-100'>Archly</span>
          <MdAddLocationAlt className='text-xl text-green-100' name='logo' />
        </div>
        <menu className='none w-auto items-center justify-center space-x-8 px-0 lg:flex'>
          <RouterLink href='/'>Home</RouterLink>
          <RouterLink href='/sites'>Sites</RouterLink>
          <RouterLink href='/about'>About</RouterLink>
        </menu>
        <div className='inline-flex '>
          <UserTools isLoggedIn={isLoggedIn} />
          <UserStatus />
        </div>
      </div>
    </header>
  )
}

export default Header
