import { useRef } from 'react'

export interface DrawerProperties {
  isOpen: boolean
  setIsOpen: (isOpen: boolean) => void
  children: React.ReactNode
}

/**
 * **Drawer**
 * Takes any children and renders them in a drawer.
 * *Must* be wrapped in a Portal using the `usePortal` hook from `react-useportal`
 * @param isOpen: boolean - Whether the drawer is open or not
 * @param setIsOpen: (isOpen: boolean) => void - A function to set the drawer's open state
 * @param children: React.ReactNode - The contents of the drawer
 * @returns JSX.Element
 */
export function Drawer({
  children,
  isOpen,
  setIsOpen
}: DrawerProperties): JSX.Element {
  const drawerReference = useRef<HTMLDivElement>(null)
  const overlayReference = useRef<HTMLDivElement>(null)
  const contentReference = useRef<HTMLDivElement>(null)

  return (
    <div
      ref={drawerReference}
      className='absolute top-0 left-0 right-0 z-0 h-full w-screen'
    >
      <div
        ref={overlayReference}
        className={`delay-0 absolute top-0 left-0 right-0 z-0 h-full w-screen transform bg-green-900 shadow-xl  backdrop-filter transition-all duration-300 ease-in-out  backdrop:blur-xl ${
          isOpen ? 'opacity-70 ' : ' opacity-0 '
        }`}
      />
      <div
        ref={contentReference}
        className={`h-100 newsite-content absolute right-0 top-0 z-10 flex h-full w-screen max-w-lg flex-col space-y-6 overflow-y-scroll bg-gray-300 pb-10   text-green-200 transition-all delay-200 duration-300 ease-in-out dark:bg-gray-800 ${
          isOpen
            ? ' translate-x-0 opacity-100 '
            : ' translate-x-full opacity-0 '
        }`}
      >
        {children}
      </div>
      <div
        role='button'
        aria-label='Close'
        tabIndex={0}
        className='overlay h-screen w-screen cursor-pointer'
        // eslint-disable-next-line react/jsx-handler-names
        onKeyUp={(): void => setIsOpen(false)}
        // eslint-disable-next-line react/jsx-handler-names
        onClick={(): void => setIsOpen(false)}
      />
    </div>
  )
}
