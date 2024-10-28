import { v4 as uuidv4 } from "uuid"
import { createConfig, custom } from "wagmi"
import {
  arbitrum,
  avalanche,
  base,
  klaytn,
  mainnet,
  optimism,
  polygon,
  sepolia
} from "wagmi/chains"
import { coinbaseWallet } from "wagmi/connectors"

interface RpcProxyRequest {
  type: "TLINK_RPC_PROXY_REQ"
  requestId: string
  url: string
  method: string
  params?: any
}

interface RpcProxyResponse {
  type: "TLINK_RPC_PROXY_RSP"
  requestId: string
  response?: any
  error?: string
}

const pendingRequests = new Map<
  string,
  { resolve: (value: any) => void; reject: (reason?: any) => void }
>()

export function handleApiResponse(event: MessageEvent) {
  const response = event.data as RpcProxyResponse
  if (response.type === "TLINK_RPC_PROXY_RSP") {
    const request = pendingRequests.get(response.requestId)
    if (request) {
      pendingRequests.delete(response.requestId)
      if (response.error) {
        request.reject(new Error(response.error))
      } else {
        request.resolve(response.response.result)
      }
    }
  }
}

function sendApiRequest(
  url: string,
  method: string,
  params?: any
): Promise<any> {
  return new Promise((resolve, reject) => {
    const requestId = uuidv4()
    pendingRequests.set(requestId, { resolve, reject })

    window.postMessage({
      type: "TLINK_RPC_PROXY_REQ",
      requestId,
      url,
      method,
      params
    } as RpcProxyRequest)
  })
}

export const config = createConfig({
  chains: [
    mainnet,
    sepolia,
    polygon,
    optimism,
    arbitrum,
    base,
    avalanche,
    klaytn
  ],
  connectors: window.location.href.startsWith("https://wallet.coinbase.com/")
    ? []
    : [coinbaseWallet({ appName: "tlink", preference: "smartWalletOnly" })],
  transports: {
    [mainnet.id]: createCustomTransport(mainnet.rpcUrls.default.http[0]),
    [sepolia.id]: createCustomTransport(sepolia.rpcUrls.default.http[0]),
    [polygon.id]: createCustomTransport(polygon.rpcUrls.default.http[0]),
    [optimism.id]: createCustomTransport(optimism.rpcUrls.default.http[0]),
    [arbitrum.id]: createCustomTransport(arbitrum.rpcUrls.default.http[0]),
    [base.id]: createCustomTransport(base.rpcUrls.default.http[0]),
    [avalanche.id]: createCustomTransport(avalanche.rpcUrls.default.http[0]),
    [klaytn.id]: createCustomTransport(klaytn.rpcUrls.default.http[0])
  }
})

function createCustomTransport(rpcUrl: string) {
  return custom({
    async request({ method, params }) {
      return sendApiRequest(rpcUrl, method, params)
    }
  })
}

declare module "wagmi" {
  interface Register {
    config: typeof config
  }
}
