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
  payload: object
) {
  payload = payload || {}
  console.log("type", type)
  console.log("wallet", wallet)
  console.log("payload", payload)

  switch (type) {
    case "getConnectedAccount":
      const connectedAccountRes = await chrome.scripting.executeScript({
        world: "MAIN",
        target: { tabId },
        args: [payload, wallet],
        func: async (payload, wallet) => {
          // @ts-ignore
          const provider = window.ethereum
          if (wallet === "rabby" && !provider.isRabby) {
            return
          }
          const accounts = await provider.request({
            method: "eth_accounts"
          })
          return accounts[0] || ""
        }
      })
      return connectedAccountRes[0].result
    case "connect":
      console.log("connecting wallet", wallet)
      const connectRes = await chrome.scripting.executeScript({
        world: "MAIN",
        target: { tabId: tabId },
        args: [payload, wallet],
        func: async (payload, wallet) => {
          // @ts-ignore
          const provider = window.ethereum
          if (wallet === "rabby" && !provider.isRabby) {
            return
          }
          const accounts = await provider.request({
            method: "eth_requestAccounts"
          })
          return accounts[0]
        }
      })
      console.log("result", connectRes)
      return connectRes[0].result

    case "eth_sendTransaction":
      const sendTransactionRes = await chrome.scripting.executeScript({
        world: "MAIN",
        target: { tabId: tabId },
        func: async (payload: { txData: any; chainId: string }, wallet) => {
          try {
            // @ts-ignore
            const provider = window.ethereum
            if (wallet === "rabby" && !provider.isRabby) {
              return
            }
            const currentChainId = await provider.request({
              method: "eth_chainId"
            })
            let targetChainId = payload.chainId

            // 确保 targetChainId 是正确的格式
            if (!targetChainId.startsWith("0x")) {
              targetChainId = "0x" + parseInt(targetChainId).toString(16)
            }

            if (currentChainId !== targetChainId) {
              await provider.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: targetChainId }]
              })
            }

            const res = await provider.request({
              method: "eth_sendTransaction",
              params: [payload.txData]
            })
            return res
          } catch (e: any) {
            console.log("error", e)
            return { error: e.message ?? "Unknown error" }
          }
        },
        // @ts-ignore
        args: [payload, wallet]
      })
      return sendTransactionRes[0].result

    case "sign_message":
      break

    default:
      // TODO:
      //  case "eth_accounts":
      //  case "eth_getCode":
      //  case "eth_chainId":
      //  case "net_version":
      //  case "eth_blockNumber":
      //  case "eth_estimateGas":
      //  case "eth_getTransactionByHash":
      //  case "eth_getTransactionReceipt":
      //  case "eth_getTransactionCount":
      //  case "personal_sign":
      //  case "eth_call":
      //  case "eth_signTypedData":
      //  case "eth_signTypedData_v4":
      //  case "eth_getBlockByNumber":
      //  case "wallet_switchEthereumChain"
      console.log("Unknown type", type)
      break
  }
}
