'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export const GoogleAnalyticsTrackPv = ({
  GA_MEASUREMENT_ID,
}: {
  GA_MEASUREMENT_ID: string
}) => {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const url = pathname + searchParams.toString()

    pageview(GA_MEASUREMENT_ID, url)
  }, [pathname, searchParams, GA_MEASUREMENT_ID])

  return null
}

const pageview = (GA_MEASUREMENT_ID: string, url: string) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: url,
    })
  }
}
