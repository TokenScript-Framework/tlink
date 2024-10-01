'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ActionConfig, ActionContainer, useAction } from '@repo/tlinks'
import '@repo/tlinks/index.css'
import { useAccount } from 'wagmi'

export const TlinkCard = (props: { url: string }) => {
  const { openConnectModal } = useConnectModal()
  const { address } = useAccount()
  console.log('address', address)

  const { action } = useAction({
    url: props.url,

    adapter: new ActionConfig({
      connect: () => {
        if (!address) {
          openConnectModal?.()
          return Promise.resolve(null)
        } else {
          return Promise.resolve(address)
        }
      },
      signTransaction: () => {
        console.log('signTransaction')
        return Promise.resolve({ signature: '123' })
      },
      getConnectedAccount: () => {
        console.log('getConnectedAccount')
        return Promise.resolve('123')
      },
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
      </div>
    )
  )
}
