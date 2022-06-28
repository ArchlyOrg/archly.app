import RouterLink from './RouterLink'

function Footer(): JSX.Element {
  return (
    <footer
      className='
      h-75px
      align-center
      fixed
      bottom-0
      left-0
      right-0
      z-[1000]
      flex
      w-full
      content-center
      items-center
      justify-center
      px-10
      py-1'
    >
      <div className='mx-auto text-lg font-medium text-green-100'>
        <RouterLink href='/'>archly.app</RouterLink>
      </div>
    </footer>
  )
}

export default Footer
