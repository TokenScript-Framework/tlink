'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export function Header() {
  return (
    <header className="border-b border-gray-800">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Tlink
          </span>
        </Link>
        <ConnectButton showBalance={false} />
      </div>
    </header>
  )
}
