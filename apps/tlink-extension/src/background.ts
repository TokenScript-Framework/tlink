// never mark the function here async
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log("on message", msg, sender)
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

  if (!msg.wallet) return false

  new Promise((resolve) => {
    chrome.storage.local.get(["openInTsViewer"], (storage) => {
      resolve(storage.openInTsViewer)
    })
  }).then((openInTsViewer) => {
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

    handleWalletCommunication(sender.tab.id, msg.type, msg.wallet, msg.payload)
      .then((res) => {
        sendResponse(res)
      })
      .catch((err) => {
        console.error("error handling message", err)
      })
  })

  return true
})

async function handleWalletCommunication(
  tabId: number,
  type: string,
  wallet: string,
  payload: any | { txData: any; chainId: string }
) {
  payload = payload || {}
  console.log("type", type)
  console.log("wallet", wallet)
  console.log("payload", payload)

  let rpcMethod = type
  if (type === "getConnectedAccount") {
    rpcMethod = "eth_accounts"
  } else if (type === "connect") {
    rpcMethod = "eth_requestAccounts"
  }

  const params = [payload.txData]

  const targetChainId = payload.chainId || "0"

  const resp = await chrome.scripting.executeScript({
    world: "MAIN",
    target: { tabId },
    args: [rpcMethod, params, targetChainId, wallet],
    func: async (rpcMethod, params, targetChainId, wallet) => {
      try {
        const provider = window.ethereum
        if (wallet === "rabby" && !provider.isRabby) {
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

          if (currentChainId !== targetChainId) {
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

        if (["eth_accounts", "eth_requestAccounts"].includes(rpcMethod)) {
          return res[0] || ""
        }

        return res
      } catch (e: any) {
        console.log("error", e)
        return { error: e.message ?? "Unknown error" }
      }
    }
  })
  return resp[0].result
}
