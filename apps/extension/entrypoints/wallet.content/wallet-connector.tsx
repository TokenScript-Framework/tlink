import { ChooseWallet } from "@/entrypoints/wallet.content/components/choose-wallet"
import { ConnectedCard } from "@/entrypoints/wallet.content/components/connected-card"
import { PendingIndicator } from "@/entrypoints/wallet.content/components/pending-indicator"
import { Connector, useAccount, useConnect } from "wagmi"

export const WalletConnector = () => {
  const { isConnected } = useAccount()
  const { connect, status } = useConnect()
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(
    null
  )

  function handleConnect(connector: Connector) {
    setSelectedConnector(connector)
    connect({ connector })
  }

  if (isConnected) {
    return <ConnectedCard />
  }

  return (
    <div className="w-full">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        {status === "pending" ? "Connecting..." : "Connect wallet"}
      </h2>

      {status === "pending" ? (
        selectedConnector && (
          <PendingIndicator selectedConnector={selectedConnector} />
        )
      ) : (
        <ChooseWallet onConnect={handleConnect} />
      )}

      <div className="mt-6 text-center text-sm text-gray-500">
        Powered by <span className="font-semibold">tlink</span>
      </div>
    </div>
  )
}
