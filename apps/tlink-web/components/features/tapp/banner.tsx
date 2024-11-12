/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'

export function TappBanner() {
  return (
    <div className="relative h-[130px] overflow-hidden bg-[#1A1A1A] md:h-[260px]">
      <img
        src="https://launchpad.smartlayer.network/images/mooar/bg-grid.png"
        className="absolute inset-0 size-full object-cover"
        alt="background grid"
      />
      <div className="container relative  mt-9 flex mx-auto">
        <Link
          href="/"
          className="flex items-center gap-1 self-start rounded-full bg-white pl-1 pr-4 hover:underline text-black"
        >
          <ChevronLeft />
          <div className="text-lg font-[500] ">Return</div>
        </Link>
      </div>
    </div>
  )
}
