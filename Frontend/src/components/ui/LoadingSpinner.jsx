import { memo } from 'react'

export const LoadingSpinner = memo(() => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      Loading...
    </div>
  )
})
