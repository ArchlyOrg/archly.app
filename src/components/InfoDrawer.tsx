import { useRef, useState } from 'react'

import { Button, Drawer } from 'react-daisyui'
// import { Link } from "react-router-dom"
import type { Site } from 'thin-backend'

const side = (
  <ul className='menu w-80 overflow-y-auto bg-base-200 p-4'>
    <li>
      <a href='#hello'>Sidebar Item 1</a>
    </li>
    <li>
      <a href='#hello'>Sidebar Item 2</a>
    </li>
  </ul>
)

interface InfoDrawerProperties {
  site: Site | null
}
export default function InfoDrawer({
  site
}: InfoDrawerProperties): JSX.Element {
  const buttonReference = useRef<HTMLButtonElement>(null)
  const [isOpen, setIsOpen] = useState<boolean>()

  const onOpen = (): void => {
    if (buttonReference.current) {
      buttonReference.current.focus()
    }
    setIsOpen(!isOpen)
  }

  return (
    <Drawer
      id='sidebar-id'
      className='h-screen w-full'
      open={isOpen}
      side={side}
    >
      <input id='my-drawer' type='checkbox' className='drawer-toggle' />
      <div className='flex w-full items-center justify-center'>
        <Button onClick={onOpen} className='btn btn-primary drawer-button'>
          More info
        </Button>
        <div>More info</div>
        <div>
          <div className='w-lg'>
            <p>{site?.description}</p>
          </div>
        </div>
      </div>
    </Drawer>
  )
}
