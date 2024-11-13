import { TappBanner } from '@/components/features/tapp/banner'
import { TappDetail } from '@/components/features/tapp/tapp-detail'
import { Header } from '@/components/header'
import { Metadata } from 'next/types'

export async function generateMetadata(v: {
  searchParams: { chain: string; contract: string; tokenId: string }
}): Promise<Metadata> {
  const { chain, contract, tokenId } = v.searchParams

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : 'http://localhost:3000'

  return {
    title: 'Tlink',
    openGraph: {
      images: [`${baseUrl}/api/og/${chain}/${contract}/${tokenId}`],
    },
  }
}

export default function Tapp() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <Header />
      <TappBanner />
      <TappDetail />
    </div>
  )
}
