/* eslint-disable @next/next/no-img-element */

import { Footer } from '@/components/footer'
import { Header } from '@/components/header'
import { TlinkCard } from '@/components/tlink-card'

export default function Page() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-900">
      <Header />
      <main className="flex-grow flex justify-center items-center">
        <div className="max-w-96">
          <TlinkCard url="https://www.charityconnect.io/" />
        </div>
      </main>
      <Footer />
    </div>
  )
}
