import { DarkModeButton, NewSiteButton } from '@archly/components'

export interface UserToolsProperties {
  isLoggedIn: boolean | null
}
export default function UserTools({
  isLoggedIn
}: UserToolsProperties): JSX.Element {
  return (
    <div className='user-tools space-l-3 inline-flex flex-nowrap items-center justify-end'>
      <DarkModeButton />
      {isLoggedIn ? <NewSiteButton /> : undefined}
    </div>
  )
}
