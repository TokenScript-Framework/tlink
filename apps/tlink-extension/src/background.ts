// never mark the function here async
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  // console.log(
  //   "tlink messaging 33333333333333333333 on message",
  //   msg,
  //   sender,
  //   typeof sender
  // )
  if (!sender.tab || !sender.tab.id) {
    return null
  }

  if (msg.type === "getSelectedWallet") {
    chrome.storage.local.get(["selectedWallet"], (storage) => {
      console.log("selectedWallet", storage.selectedWallet)
      sendResponse(storage.selectedWallet)
    })
    return true
  }

  if (msg.type !== "rpc" && !msg.wallet) return false

  new Promise((resolve) => {
    chrome.storage.local.get(
      ["openInTsViewer", "selectedWallet"],
      (storage) => {
        resolve([storage.openInTsViewer, storage.selectedWallet])
      }
    )
  }).then(([openInTsViewer, selectedWallet]: any) => {
    if (
      openInTsViewer &&
      msg.type !== "connect" &&
      msg.type !== "getConnectedAccount"
    ) {
      const metadata = msg.payload?.metadata
      if (!metadata) {
        return
      }
      const { contract, tokenId, actionName } = metadata
      chrome.tabs.create({
        url: `https://viewer.tokenscript.org/?chain=${msg.payload.chainId}&contract=${contract}&tokenId=${tokenId}#card=${actionName}`
      })
      return sendResponse({ signature: "done" })
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
      tabId: sender.tab.id,
      rpcMethod,
      walletType: selectedWallet,
      params,
      targetChainId
    })
      .then((res) => {
        // console.log("tlink messaging testing res", res, {
        //   tabId: sender.tab.id,
        //   rpcMethod,
        //   walletType: selectedWallet,
        //   params,
        //   targetChainId
        // })

        if (["connect", "getConnectedAccount"].includes(msg.type)) {
          sendResponse(res[0] || "")
        } else {
          sendResponse(res)
        }
      })
      .catch((err) => {
        console.error("error handling message", err)
      })
  })

  return true
})

async function handleWalletCommunication({
  tabId,
  rpcMethod,
  walletType,
  params,
  targetChainId
}: {
  tabId: number
  rpcMethod: string
  walletType: string
  params: any
  targetChainId: string
}) {
  const resp = await chrome.scripting.executeScript({
    world: "MAIN",
    target: { tabId },
    args: [rpcMethod, params, targetChainId, walletType],
    func: async (
      rpcMethod: string,
      params: any,
      targetChainId: string,
      walletType: string
    ) => {
      try {
        const provider = window.ethereum
        if (walletType === "rabby" && !provider.isRabby) {
          return
        }

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

        const res = await provider.request({
          method: rpcMethod,
          params: ["eth_accounts", "eth_requestAccounts"].includes(rpcMethod)
            ? undefined
            : params
        })

        return res
      } catch (e: any) {
        const innerError = e.walk()
        if (innerError) e = innerError

        console.log("error", e)
        return {
          error: e.message + (e.data?.message ? " " + e.data?.message : ""),
          message: e.message + (e.data?.message ? " " + e.data?.message : ""),
          code: e.data?.code ?? e.code
        }
      }
    }
  })

  return resp[0].result
}
