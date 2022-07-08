import type { ReactElement } from 'react'

interface Properties {
  error?: Error
}
export default function LoadingOrError({ error }: Properties): ReactElement {
  return (
    <div className='absolute top-0 left-0 flex h-screen w-full items-center justify-center'>
      <h1 className='text-xl' data-testid='LoadingOrError'>
        {error ? error.message : 'Loading...🥳'}
      </h1>
    </div>
  )
}
LoadingOrError.defaultProps = {
  error: undefined
}
