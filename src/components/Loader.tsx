import { FaSpinner } from 'react-icons/fa'

function Loader(): JSX.Element {
  return (
    <div
      className='
			align-center
			absolute
			top-0
			left-0
			z-[5000]
			flex
			h-screen
			w-screen
			bg-black
			text-center
			text-white'
    >
      <p>
        <FaSpinner />
      </p>
    </div>
  )
}

export default Loader
