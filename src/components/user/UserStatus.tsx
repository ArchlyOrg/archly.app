import '@archly/styles/UserStatus.css'
import { ConnectButton } from 'web3uikit'

export default function UserStatus(): JSX.Element {
  const message =
    '** Archly SignIn!**\n\n Archly uses Moralis for User & site data, signing this transaction will create an account with Archly.\n If you wish to proceed, please sign-in to your Ethereum account.'
  return (
    <div className='user-status inline-flex flex-row flex-nowrap items-center justify-end space-x-0'>
      <ConnectButton signingMessage={message} />
    </div>
  )
}
