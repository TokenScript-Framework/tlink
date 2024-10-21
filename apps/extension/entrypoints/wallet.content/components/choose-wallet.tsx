import { Badge } from "@/components/badge"
import { ConnectorIcon } from "@/entrypoints/wallet.content/components/connector-icon"
import { Connector, useConnect } from "wagmi"

export function ChooseWallet(props: {
  onConnect: (connector: Connector) => void
}) {
  const { connectors, error } = useConnect()

  return (
    <div className="space-y-4">
      {connectors.map((connector) => {
        return (
          <Button
            key={connector.uid}
            variant="outline"
            className="w-full justify-between text-left font-normal h-16 rounded-lg"
            type="button"
            onClick={() => props.onConnect(connector)}>
            <div className="flex items-center gap-3">
              <ConnectorIcon connector={connector} />

              <span className="text-lg text-[#383c48]">{connector.name}</span>
            </div>
            <Badge variant="outline" className="bg-[#EEEEF1] py-1">
              {connector.type === "injected" ? "Installed" : "Recommend"}
            </Badge>
          </Button>
        )
      })}

      <div>{error?.message}</div>
    </div>
  )
}
