import { usePublicClient, useWalletClient } from "wagmi"

const WalletRpcMethods = new Set([
  "eth_accounts",
  "eth_chainId",
  // "eth_estimateGas",
  "eth_requestAccounts",
  "eth_sendTransaction",
  "eth_sendRawTransaction",
  "eth_sign",
  "eth_signTransaction",
  "eth_signTypedData_v4",
  "eth_syncing",
  "personal_sign",
  "wallet_addEthereumChain",
  "wallet_getCallsStatus",
  "wallet_getCapabilities",
  "wallet_getPermissions",
  "wallet_grantPermissions",
  "wallet_requestPermissions",
  "wallet_revokePermissions",
  "wallet_sendCalls",
  "wallet_showCallsStatus",
  "wallet_switchEthereumChain",
  "wallet_watchAsset"
])

export function GlobalApiSetup() {
  const publicClient = usePublicClient()
  const walletClient = useWalletClient()

  useEffect(() => {
    if (publicClient && walletClient?.data) {
      window.tlink = {
        request: (v: any) => {
          if (WalletRpcMethods.has(v.method)) {
            return walletClient.data?.request(v)
          } else {
            return publicClient.request(v)
          }
        }
      }
    } else {
      window.tlink = undefined
    }
  }, [publicClient, walletClient])

  return null
}
