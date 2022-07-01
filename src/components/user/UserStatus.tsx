import { ConnectButton } from 'web3uikit'

export default function UserStatus(): JSX.Element {
  return (
    <div className='flex flex-row flex-nowrap items-center'>
      <ConnectButton />
    </div>
  )
}
