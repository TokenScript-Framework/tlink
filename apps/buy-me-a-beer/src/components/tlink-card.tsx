/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRpcMessage } from '@/app/hooks/use-rpc-message'
import { Skeleton } from '@/components/ui/skeleton'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { ActionConfig, ActionContainer, useAction } from '@repo/tlinks'
import '@repo/tlinks/index.css'
import { useAccount, useSwitchChain } from 'wagmi'

export const TlinkCard = (props: { url: string }) => {
  const { openConnectModal } = useConnectModal()
  const { address, chainId } = useAccount()
  const { switchChainAsync } = useSwitchChain()
  const { handleRpcMessage } = useRpcMessage()

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
      signTransaction: async ({ txData, chainId: targetChainId }: any) => {
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
        console.log('getConnectedAccount')
        return Promise.resolve('123')
      },
      metadata: {},
    }),
  })

  if (!action) {
    return <TlinkSkeleton />
  }

  return (
    <div className="min-w-96">
      <ActionContainer
        action={action}
        websiteUrl={props.url}
        websiteText={props.url}
        callbacks={{
          onActionMount: () => {},
        }}
      />
    </div>
  )
}

function TlinkSkeleton() {
  return (
    <div className="max-w-96">
      <div className="min-w-96">
        <div className="tlink dial-light">
          <div className="w-full overflow-hidden rounded-2xl border border-stroke-primary bg-bg-primary shadow-action">
            <div className="px-5 pt-5">
              <Skeleton className="aspect-video w-full rounded-xl" />
            </div>
            <div className="flex flex-col p-5">
              <div className="mb-2 flex items-center gap-2">
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="mb-0.5 h-6 w-3/4" />
              <Skeleton className="mb-4 h-4 w-1/2" />
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex flex-grow basis-[calc(33.333%-2*4px)]"
                    >
                      <Skeleton className="h-12 w-full rounded-button" />
                    </div>
                  ))}
                </div>
                <div>
                  <Skeleton className="h-12 w-full rounded-input-standalone" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
