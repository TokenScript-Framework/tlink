/* eslint-disable @typescript-eslint/no-explicit-any */
import { IframePopup, IframePopupRef } from '@/components/iframe-popup'
import { RendererTokenScriptIframe } from '@/components/RendererTokenScriptIframe'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ActionConfig, ActionContainer, useAction } from '@repo/tlinks'
import { useRef, useState } from 'react'
import { useAccount, useSendTransaction, useSwitchChain } from 'wagmi'

export const TlinkCard = (props: { url: string }) => {
  const { openConnectModal } = useConnectModal()
  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const [dAppUrl, setDAppUrl] = useState('')
  const iframePopupRef = useRef<IframePopupRef>(null)
  const { sendTransactionAsync } = useSendTransaction()

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
        return sendTransactionAsync({
          ...txData,
          chainId: Number(targetChainId),
        }) as any
      },
      getConnectedAccount: () => {
        return Promise.resolve(address || null)
      },
      interceptHandlePost: (href) => {
        if (
          href.includes('tokenscript.org') ||
          href.startsWith('http://localhost:3333/')
        ) {
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

  return (
    action && (
      <div className="min-w-96">
        <ActionContainer
          action={action}
          websiteUrl={props.url}
          websiteText={props.url}
        />
        <IframePopup ref={iframePopupRef} dAppUrl={dAppUrl} />
      </div>
    )
  )
}
