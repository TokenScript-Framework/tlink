/* eslint-disable sonarjs/cognitive-complexity */
import { RefObject, useEffect } from "react"
import { useWalletClient } from "wagmi"

export const useIframePostMessage = (
  iframeRef: RefObject<HTMLIFrameElement>,
  targetOrigin: string
) => {
  const { data: walletClient } = useWalletClient()

  useEffect(() => {
    function sendResponse(
      messageData: MessageEvent["data"],
      response: any,
      error?: any
    ) {
      const data = messageData

      if (error) {
        data.error = error
      } else {
        data.result = response
      }

      iframeRef.current?.contentWindow?.postMessage(data, "*")
    }

    const handleMessage = async (event: MessageEvent) => {
      if (!walletClient) {
        return
      }

      if (!event.data.method) {
        return
      }

      try {
        switch (event.data.method) {
          case "eth_accounts":
          case "eth_requestAccounts": {
            const data = await walletClient.request({
              method: event.data.method
            })
            sendResponse(event.data, data)
            break
          }
          case "eth_getCode":
          case "eth_chainId":
          case "net_version":
          case "eth_blockNumber":
          case "eth_estimateGas":
          case "eth_sendTransaction":
          case "eth_getTransactionByHash":
          case "eth_getTransactionReceipt":
          case "eth_getTransactionCount":
          case "personal_sign":
          case "eth_call":
          case "eth_signTypedData":
          case "eth_signTypedData_v4":
          case "eth_getBlockByNumber":
          case "wallet_switchEthereumChain": {
            const data = await walletClient.request({
              method: event.data.method,
              params: event.data.params
            })
            sendResponse(event.data, data)
            break
          }

          default:
            sendResponse(event.data, null, {
              code: -1,
              message: "RPC Method " + event.data.method + " is not implemented"
            })
            break
        }
      } catch (e: any) {
        const innerError = e.walk()

        if (innerError) e = innerError

        sendResponse(event.data, null, {
          code: e.data?.code ?? e.code,
          message: e.message + (e.data?.message ? " " + e.data?.message : "")
        })
      }
    }

    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  }, [iframeRef, targetOrigin, walletClient])
}
