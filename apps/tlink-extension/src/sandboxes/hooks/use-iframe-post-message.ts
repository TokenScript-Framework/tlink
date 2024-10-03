/* eslint-disable sonarjs/cognitive-complexity */

async function handleRpcRequestAndGetResponse(eventData: any, provider: any) {
  if (!provider || !eventData.method) {
    return null
  }

  try {
    switch (eventData.method) {
      case "eth_accounts":
      case "eth_requestAccounts": {
        const data = await provider.request({
          method: eventData.method
        })
        return buildResponse(eventData, data)
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
        const data = await provider.request({
          method: eventData.method,
          params: eventData.params
        })
        return buildResponse(eventData, data)
      }

      default:
        return buildResponse(eventData, null, {
          code: -1,
          message: "RPC Method " + eventData.method + " is not implemented"
        })
    }
  } catch (e: any) {
    const innerError = e.walk()
    if (innerError) e = innerError

    return buildResponse(eventData, null, {
      code: e.data?.code ?? e.code,
      message: e.message + (e.data?.message ? " " + e.data?.message : "")
    })
  }
}

function buildResponse(
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

  return data
}
