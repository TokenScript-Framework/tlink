import { ConnectorIcon } from "@/entrypoints/wallet.content/components/connector-icon"
import { formatAddress } from "@/lib/format-address"
import { LogOut } from "lucide-react"
import { useAccount, useDisconnect } from "wagmi"

export function ConnectedCard() {
  const { connector, address } = useAccount()
  const { disconnect } = useDisconnect()

  if (!address) {
    return null
  }

  return (
    <div className="w-full min-h-[500px] flex flex-col">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Wallet
      </h2>

      <div className="grow flex flex-col justify-between">
        <div className="flex items-center justify-center gap-4 bg-white p-4 rounded-lg">
          {connector && <ConnectorIcon connector={connector} />}
          <span className="text-lg text-[#383c48]">
            {formatAddress(address!)}
          </span>
        </div>
        <Button
          onClick={() => disconnect()}
          type="button"
          variant="outline"
          className="w-full justify-center border border-gray-300 rounded-lg flex items-center h-12">
          <div className="flex items-center gap-2">
            <LogOut className="w-6 h-6" />
            Disconnect
          </div>
        </Button>
      </div>

      <div className="mt-6 text-center text-sm text-gray-500">
        Powered by <span className="font-semibold">tlink</span>
      </div>
    </div>
  )
}
