'use client'
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionConfig, ActionContainer, useAction } from '@repo/tlinks'
import '@repo/tlinks/index.css'

export const TlinkCard = (props: { url: string }) => {
  const { action } = useAction({
    url: props.url,
    adapter: new ActionConfig({
      signTransaction: () => {},
      connect: () => {},
      getConnectedAccount: () => {},
      metadata: {},
    } as any),
  })

  return (
    action && (
      <div className="min-w-96">
        <ActionContainer
          action={action}
          websiteUrl="https://x.com/ddwchen"
          websiteText=""
        />
      </div>
    )
  )
}
