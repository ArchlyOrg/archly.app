import '@archly/styles/UserStatus.css'
import { ConnectButton } from 'web3uikit'

export default function UserStatus(): JSX.Element {
  return (
    <div className='user-status inline-flex flex-row flex-nowrap items-center justify-end space-x-0'>
      <ConnectButton />
    </div>
  )
}
