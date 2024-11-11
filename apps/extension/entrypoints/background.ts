export default defineBackground(() => {
  // never mark the function here async
  chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (!sender.tab || !sender.tab.id) {
      return null
    }

    let rpcMethod: string = ""
    let params: any = []

    if (msg.type === "rpc") {
      rpcMethod = msg.data.method
      params = msg.data.params
    } else {
      rpcMethod = msg.type
      if (msg.type === "getConnectedAccount") {
        rpcMethod = "eth_accounts"
      } else if (msg.type === "connect") {
        rpcMethod = "eth_requestAccounts"
      }
      params = [msg?.payload?.txData]
    }

    const targetChainId = msg?.payload?.chainId || "0"

    handleWalletCommunication({
      tabId: sender.tab!.id!,
      rpcMethod,
      params,
      targetChainId
    })
      .then((res) => {
        if (["connect", "getConnectedAccount"].includes(msg.type)) {
          sendResponse(res.result?.[0] || "")
        } else {
          sendResponse(res)
        }
      })
      .catch((err) => {
        console.error("error handling message", err)
      })

    return true
  })

  async function handleWalletCommunication({
    tabId,
    rpcMethod,
    params,
    targetChainId
  }: {
    tabId: number
    rpcMethod: string
    params: any
    targetChainId: string
  }) {
    const resp = await chrome.scripting.executeScript({
      world: "MAIN",
      target: { tabId },
      args: [rpcMethod, params, targetChainId],
      func: async (rpcMethod: string, params: any, targetChainId: string) => {
        try {
          const provider = window.tlink || window.ethereum

          // switch chain if needed
          if (rpcMethod === "eth_sendTransaction") {
            const currentChainId = await provider.request({
              method: "eth_chainId"
            })

            if (!targetChainId.startsWith("0x")) {
              targetChainId = "0x" + parseInt(targetChainId).toString(16)
            }

            if (targetChainId !== "0x0" && currentChainId !== targetChainId) {
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: targetChainId }]
              })
            }
          }

          const result = await provider.request({
            method: rpcMethod,
            params: ["eth_accounts", "eth_requestAccounts"].includes(rpcMethod)
              ? undefined
              : params
          })

          return { result }
        } catch (e: any) {
          if (e.walk) e = e.walk()

          return {
            error: e
          }
        }
      }
    })

    return resp[0].result
  }
})
