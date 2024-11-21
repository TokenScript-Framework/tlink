'use client'
import { TlinkCard } from '@/components/tlink-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { TLINK_EXTENSION_URL } from '@/lib/constants'
import { formatTokenScriptTitle } from '@/lib/format-tokenscript-title'
import { handleGetTokenScriptAction } from '@/lib/handle-get-ts-action'
import { useQuery } from '@tanstack/react-query'
import { Chrome, ExternalLink, Globe } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export function TappDetail() {
  const searchParams = useSearchParams()
  const { data } = useQuery({
    queryKey: [
      'tlink-data',
      searchParams.get('chain'),
      searchParams.get('contract'),
      searchParams.get('scriptId'),
    ],
    queryFn: () => handleGetTokenScriptAction(new URL(window.location.href)),
  })
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  const tokenScriptUrl = window.location.href.replace(
    window.location.host + '/tapp',
    'viewer.tokenscript.org/',
  )

  const displayName = formatTokenScriptTitle(data?.tsMetadata.name || '')

  return (
    <main className="container mx-auto px-4 py-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="px-0 md:p-8">
            <div className="flex flex-col lg:flex-row gap-12">
              {/* Left Column   */}
              <div className="flex-1">
                <TlinkCard url={tokenScriptUrl} />
              </div>

              {/* Right Column - Content */}
              <div className="flex flex-col gap-8 justify-between px-4 md:px-0 flex-1">
                <div className="flex flex-col gap-6">
                  <h1 className="text-5xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent leading-relaxed">
                    {displayName}
                  </h1>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {data?.tsMetadata.meta.description}
                  </p>
                  {data?.tsMetadata.meta.aboutUrl && (
                    <Button
                      className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                                 text-white font-bold flex items-center gap-2 px-8 py-6 text-lg rounded-xl
                                 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105 w-full"
                      asChild
                    >
                      <Link
                        href={data.tsMetadata.meta.aboutUrl}
                        target="_blank"
                        className="flex items-center min-w-0"
                        rel="noopener noreferrer"
                      >
                        <Globe className="mr-2 h-6 w-6 flex-shrink-0" />
                        <span className="truncate">
                          Visit {displayName} website
                        </span>
                        <ExternalLink className="ml-2 h-4 w-4 flex-shrink-0" />
                      </Link>
                    </Button>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-xl p-6 border border-blue-500/20">
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-blue-200 bg-clip-text text-transparent">
                      Want to use tlink directly on Twitter?
                    </h2>
                    <div className="text-xl font-semibold mt-2 text-blue-300">
                      Install the Tlink extension now!
                    </div>
                  </div>
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700
                                 text-white font-bold flex items-center gap-2 px-8 py-6 text-lg rounded-xl
                                 shadow-lg shadow-blue-500/25 transition-all duration-200 hover:scale-105"
                    asChild
                  >
                    <Link href={TLINK_EXTENSION_URL} target="_blank">
                      <Chrome className="w-6 h-6" />
                      Install Extension
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
