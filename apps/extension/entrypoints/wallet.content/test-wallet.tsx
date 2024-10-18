import { config } from "@/entrypoints/wallet.content/wagmi"
import { signMessage } from "@wagmi/core"
import { useAccount, useBalance, useConnect, useDisconnect } from "wagmi"
import { polygon } from "wagmi/chains"

export function TestWallet() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const result = useBalance({
    chainId: polygon.id,
    address: "0x6C30A9544D885F85812e9B92f38EC1dD5f31BB65"
  })

  console.log("balance result", result)

  return (
    <>
      <div>
        <h2>Account</h2>

        <div>
          status: {account.status}
          <br />
          addresses: {JSON.stringify(account.addresses)}
          <br />
          chainId: {account.chainId}
        </div>

        {account.status === "connected" && (
          <button type="button" onClick={() => disconnect()}>
            Disconnect
          </button>
        )}

        <div>balance: {result.data?.formatted}</div>
      </div>

      <div>
        <h2>Connect</h2>
        {connectors.map((connector) => (
          <button
            key={connector.uid}
            onClick={() => connect({ connector })}
            type="button">
            {connector.name}
          </button>
        ))}
        <div>{status}</div>
        <div>{error?.message}</div>

        <button
          onClick={async () => {
            const result = await signMessage(config, {
              message: "hello world"
            })
            console.log("sign result", result)
          }}>
          sign
        </button>
      </div>
    </>
  )
}
