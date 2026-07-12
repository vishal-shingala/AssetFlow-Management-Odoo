import { useRouteError } from 'react-router-dom'

import { memo } from 'react'

export const GlobalError = memo(() => {
  const error = useRouteError()

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>Oops! Something went wrong.</h1>
      <p>{error.statusText || error.message}</p>
    </div>
  )
})
