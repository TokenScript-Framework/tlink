'use client'

import { TlinkCard } from '@/components/tlink-card'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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

  return (
    <main className="container mx-auto px-4 py-8 relative z-10">
      <div className="max-w-6xl mx-auto">
        <Card className="bg-gray-800 border-gray-700 mt-[-35px] md:mt-[-70px]">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Left Column   */}
              <div className="">
                <TlinkCard url={tokenScriptUrl} />
              </div>

              {/* Right Column - Content */}
              <div className="space-y-6">
                <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-500/10 text-blue-400 rounded-full text-sm">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  <a
                    target="_blank"
                    className="hover:underline"
                    href={tokenScriptUrl}
                  >
                    Visit TokenScript Viewer
                  </a>
                </div>

                <h1 className="text-4xl font-bold text-white">
                  {data?.tsMetadata.name}
                </h1>

                <p className="text-gray-300 text-lg">
                  {data?.tsMetadata.meta.description}
                </p>

                <div className="flex gap-4">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold flex items-center gap-1"
                    asChild
                  >
                    <Link
                      href="https://chromewebstore.google.com/detail/tlink/eblnpllcmmepkmpaalggpibindkplcjj"
                      target="_blank"
                    >
                      <Chrome className="w-6 h-6" />
                      Install Extension
                    </Link>
                  </Button>
                  {data?.tsMetadata.meta.aboutUrl && (
                    <Button
                      variant="outline"
                      className="border-gray-700 hover:bg-gray-800 text-white hover:text-white flex items-center gap-1"
                      asChild
                    >
                      <Link
                        href={data.tsMetadata.meta.aboutUrl}
                        target="_blank"
                      >
                        <Globe className="mr-2 h-4 w-4" />
                        Visit Website
                      </Link>
                    </Button>
                  )}
                </div>

                {data?.tsMetadata.meta.aboutUrl && (
                  <Link
                    href={data.tsMetadata.meta.aboutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm text-gray-400 hover:text-gray-300"
                  >
                    Learn more about {data?.tsMetadata.name}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
