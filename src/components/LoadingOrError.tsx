import type { ReactElement } from 'react'

import '@archly/styles/Loader.css'

export function Loading(): ReactElement {
  return (
    <div className='lds-grid'>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}
interface Properties {
  error?: Error
}
export default function LoadingOrError({ error }: Properties): ReactElement {
  return (
    <div className='fixed top-0 left-0 z-[1000] flex h-screen w-full items-center justify-center'>
      {error ? (
        <div className='flex flex-col flex-wrap items-center gap-3'>
          <p className='text-6xl font-bold'>error.message</p>
        </div>
      ) : (
        <div className='flex flex-col flex-wrap items-center gap-3'>
          <Loading />
          <p className='text-6xl font-bold'>Loading...🥳</p>
        </div>
      )}
    </div>
  )
}
LoadingOrError.defaultProps = {
  error: undefined
}
