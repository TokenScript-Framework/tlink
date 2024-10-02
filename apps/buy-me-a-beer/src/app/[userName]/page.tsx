/* eslint-disable @next/next/no-img-element */

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { TlinkCard } from '@/components/tlink-card'
import { isProd } from '@/lib/utils'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { notFound } from 'next/navigation'

export default function Page({ params }: { params: { userName: string } }) {
  if (params.userName !== 'TantanFu') {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
      <main className="flex-grow flex justify-center items-center flex-col gap-4">
        <ConnectButton showBalance={false} />
        <div className="max-w-96">
          <TlinkCard
            url={
              isProd
                ? `https://buy-me-a-beer-sigma.vercel.app/${params.userName}`
                : `http://localhost:3000/${params.userName}`
            }
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
