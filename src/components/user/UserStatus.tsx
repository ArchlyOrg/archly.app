import { Button } from 'react-daisyui'
import type { LogoutOptions } from 'thin-backend'
import { logout } from 'thin-backend'
import { useCurrentUser, useIsLoggedIn } from 'thin-backend-react'

export const onLogout = (options?: LogoutOptions): boolean => {
  logout(options)
    .then(
      () =>
        // console.log('logged out', { options })
        true
    )
    .catch(error => {
      // eslint-disable-next-line no-console
      console.log('Error logging out:', error)
      return false
    })
    // eslint-disable-next-line no-console
    .finally(() => console.log('logout complete'))
  return false
}

export default function UserStatus(): JSX.Element {
  const user = useCurrentUser()
  const isLoggedIn = useIsLoggedIn()

  return (
    <div className='flex flex-row flex-nowrap items-center'>
      <span className='text-sm text-green-100'>
        {isLoggedIn && user ? user.email : ''}
      </span>
      <Button
        className='btn-primary btn-sm'
        onClick={(): boolean => onLogout()}
      >
        {isLoggedIn ? 'Logout' : 'Login'}
      </Button>
    </div>
  )
}
