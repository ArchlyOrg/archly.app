import { NewSiteButton } from '@archly/components/buttons'

export interface UserToolsProperties {
  isLoggedIn: boolean | undefined
}
export default function UserTools({
  isLoggedIn
}: UserToolsProperties): JSX.Element {
  return (
    <div className='inline-flex'>
      {isLoggedIn ? <NewSiteButton /> : undefined}
    </div>
  )
}
