'use client'

import NextTopLoader from 'nextjs-toploader'

export function ProgressBarProvider() {
  return (
    <NextTopLoader
      color="#171717"
      height={3}
      showSpinner={false}
      shadow={false}
    />
  )
}
