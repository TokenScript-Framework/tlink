import { TappBanner } from '@/components/features/tapp/banner'
import { TappDetail } from '@/components/features/tapp/tapp-detail'
import { Header } from '@/components/header'
import { Metadata } from 'next/types'
import { Suspense } from 'react'

export async function generateMetadata(v: {
  searchParams: {
    chain: string
    contract: string
    tokenId: string
    scriptId: string
  }
}): Promise<Metadata> {
  const { chain, contract, tokenId, scriptId } = v.searchParams

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  const queryParams = new URLSearchParams()
  if (tokenId) queryParams.append('tokenId', tokenId)
  if (scriptId) queryParams.append('scriptId', scriptId)

  const imageUrl = `${baseUrl}/api/og/${chain}/${contract}${
    queryParams.toString() ? `?${queryParams.toString()}` : ''
  }`

  return {
    title: 'Tlink',
    openGraph: {
      images: [imageUrl],
    },
  }
}

export default function Tapp() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <TappBanner />
      <Suspense fallback={null}>
        <TappDetail />
      </Suspense>
    </div>
  )
}
