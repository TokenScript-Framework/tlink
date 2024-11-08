"use client"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/dropdown-menu"
import { getIcon } from "@/entrypoints/wallet.content/wagmi"
import { cn } from "@/lib/utils"
import { ChevronDown, Loader2 } from "lucide-react"
import * as React from "react"
import { useAccount, useSwitchChain } from "wagmi"

export function SwitchChainDropdown() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [switchingTo, setSwitchingTo] = React.useState<number | null>(null)
  const { chain: currentChain } = useAccount()

  const { chains, switchChainAsync } = useSwitchChain()

  const handleNetworkSwitch = async (network: number) => {
    if (network === currentChain?.id) return

    setSwitchingTo(network)

    switchChainAsync({ chainId: network as any })
      .then(() => {})
      .catch((error) => {
        console.error("Failed to switch network:", error)
      })
      .finally(() => {
        setSwitchingTo(null)
        setIsOpen(false) // Close the dropdown only after switching is complete
      })
  }

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="justify-start gap-2">
          <img
            src={getIcon(currentChain?.id || 0)}
            alt=""
            className="rounded-full"
            width={24}
            height={24}
          />
          <span className="text-black">{currentChain?.name}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="" asChild>
        <div className="w-[200px] z-[100]">
          {chains.map((network) => (
            <DropdownMenuItem
              key={network.id}
              className="gap-2"
              disabled={switchingTo !== null && switchingTo !== network.id}
              onClick={(e) => {
                e.preventDefault()
                handleNetworkSwitch(network.id)
              }}>
              <img
                src={getIcon(network.id)}
                alt=""
                className="rounded-full"
                width={24}
                height={24}
              />
              <span className="flex-1">{network.name}</span>
              {switchingTo === network.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : network.id === currentChain?.id ? (
                <span className="text-sm text-muted-foreground">Connected</span>
              ) : null}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
