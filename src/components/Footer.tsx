import RouterLink from './RouterLink'

function Footer(): JSX.Element {
  return (
    <footer
      className='
      w-100
      h-75px
      fixed
      bottom-0
      left-0
      z-[1000]
      flex
      content-center
      items-center
      px-10'
    >
      <div className='text-xl font-bold'>
        <RouterLink href='/'>archly.app</RouterLink>
      </div>
    </footer>
  )
}

export default Footer
