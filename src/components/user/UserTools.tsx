import { NewSiteButton } from '@archly/components'
import { useDarkMode } from '@archly/utils/hooks'
import { Button } from 'react-daisyui'

export interface UserToolsProperties {
  isLoggedIn: boolean | null
}
export default function UserTools({
  isLoggedIn
}: UserToolsProperties): JSX.Element {
  const { toggleTheme } = useDarkMode()

  const onToggleTheme = (): void => {
    toggleTheme()
  }
  return (
    <div className='user-tools inline-flex flex-nowrap items-center space-x-3'>
      <Button className='btn-primary btn-sm' onClick={onToggleTheme}>
        Toggle
      </Button>
      {isLoggedIn ? <NewSiteButton /> : undefined}
    </div>
  )
}
