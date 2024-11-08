/* eslint-disable @typescript-eslint/no-explicit-any */
import { IframePopup, IframePopupRef } from '@/components/iframe-popup'
import { RendererTokenScriptIframe } from '@/components/RendererTokenScriptIframe'
import { Skeleton } from '@/components/ui/skeleton'
import { useRpcMessage } from '@/hooks/use-rpc-message'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import {
  ActionConfig,
  ActionContainer,
  isTokenScriptViewerUrl,
  setProxyUrl,
  useAction,
} from '@repo/tlinks'
import { Twitter } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useAccount, useSwitchChain } from 'wagmi'

export const TlinkCard = (props: { url: string; twitter?: string }) => {
  const { openConnectModal } = useConnectModal()
  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [dAppUrl, setDAppUrl] = useState('')
  const { handleRpcMessage } = useRpcMessage()
  const iframePopupRef = useRef<IframePopupRef>(null)

  useEffect(() => {
    setProxyUrl('')
  }, [])

  const { action } = useAction({
    url: props.url,
    adapter: new ActionConfig({
      connect: () => {
        console.log('connect', address)
        if (!address) {
          openConnectModal?.()
          return Promise.resolve(null)
        } else {
          return Promise.resolve(address)
        }
      },
      signTransaction: async ({ txData, chainId: targetChainId }: any) => {
        console.log('signTransaction')
        if (chainId?.toString() !== targetChainId.toString()) {
          await switchChainAsync({ chainId: Number(targetChainId) })
        }
        return handleRpcMessage('eth_sendTransaction', [txData])
          .then((resposen) => {
            console.log(resposen)
            return { signature: '123' }
          })
          .catch((e) => {
            return { error: e.message }
          })
      },
      getConnectedAccount: () => {
        return Promise.resolve(address || null)
      },
      interceptHandlePost: (href) => {
        if (isTokenScriptViewerUrl(href)) {
          setDAppUrl(href)
          iframePopupRef.current?.setOpen(true)
          return true
        } else {
          return false
        }
      },
      tsIframeRenderer: RendererTokenScriptIframe,
      metadata: {},
    }),
  })

  return action ? (
    <div className="relative">
      <ActionContainer
        action={action}
        websiteUrl={props.url}
        websiteText={props.url}
      />
      <IframePopup ref={iframePopupRef} dAppUrl={dAppUrl} />
      {props.twitter && (
        <a
          href={props.twitter}
          target="_blank"
          className="absolute top-6 right-6 text-sm text-white p-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full shadow-sm hover:scale-110 transition-transform duration-200"
        >
          <Twitter />
        </a>
      )}
    </div>
  ) : (
    <TlinkCardSkeleton />
  )
}

export function TlinkCardSkeleton() {
  return (
    <div className="min-w-96">
      <div className="w-full overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="px-5 pt-5">
          <Skeleton className="aspect-square w-full rounded-xl bg-gray-200" />
        </div>
        <div className="flex flex-col p-5">
          <div className="mb-2 flex items-center gap-2">
            <Skeleton className="h-4 w-full bg-gray-200" />
          </div>
          <Skeleton className="mb-0.5 h-6 w-1/3 bg-gray-300" />
          <Skeleton className="mb-4 h-4 w-full bg-gray-200" />
          <Skeleton className="mb-2 h-4 w-full bg-gray-200" />
          <Skeleton className="mb-4 h-4 w-3/4 bg-gray-200" />
          <div className="flex flex-wrap items-center gap-2">
            <Skeleton className="h-12 w-full flex-grow basis-[calc(33.333%-2*4px)] bg-gray-200" />
            <Skeleton className="h-12 w-full flex-grow basis-[calc(33.333%-2*4px)] bg-gray-200" />
          </div>
        </div>
      </div>
    </div>
  )
}
