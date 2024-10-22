import { ConnectorIcon } from "@/entrypoints/wallet.content/components/connector-icon"
import { Spinner } from "@/entrypoints/wallet.content/components/spinner"
import { Connector } from "wagmi"

export function PendingIndicator({
  selectedConnector
}: {
  selectedConnector: Connector
}) {
  return (
    <div className="flex items-center justify-center flex-col gap-4">
      <div className="relative w-20 h-20 flex justify-center items-center">
        {selectedConnector && (
          <ConnectorIcon
            connector={selectedConnector}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          />
        )}
        <Spinner className="w-20 h-20 animate-spin " />
      </div>
      <div className="text-sm text-gray-500">
        Click connect in your wallet popup
      </div>
    </div>
  )
}
