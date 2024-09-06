import { Storage } from "@plasmohq/storage"

chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
  console.log("on message", msg, sender)
  if (!sender.tab || !sender.tab.id) {
    return null
  }
  if (msg.type === "getSelectedWallet") {
    chrome.storage.local.get(["selectedWallet"], (storage) => {
      sendResponse(storage.selectedWallet)
    })
    return true
  }

  if (!msg.wallet) return false

  const storage = new Storage()

  const openInTsViewer = await storage.get("openInTsViewer")
  if (openInTsViewer && msg.type !== "connect") {
    const metadata = msg.payload.metadata
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

  return true
})

async function handleWalletCommunication(
  tabId: number,
  type: string,
  wallet: string,
  payload: object
) {
  console.log("type", type)
  console.log("wallet", wallet)
  console.log("payload", payload)

  switch (type) {
    case "connect":
      console.log("connecting wallet", wallet)
      const connectRes = await chrome.scripting.executeScript({
        world: "MAIN",
        target: { tabId: tabId },
        func: async () => {
          // @ts-ignore
          const provider = window.ethereum
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
