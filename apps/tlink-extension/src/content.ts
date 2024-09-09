import { ActionConfig, type TransactionPayload } from "@repo/tlinks"
import { setupTwitterObserver } from "@repo/tlinks/ext/twitter"
import styleText from "@repo/tlinks/index.css"
import type { PlasmoCSConfig, PlasmoGetStyle } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

export const getStyle: PlasmoGetStyle = () => {
  const style = document.createElement("style")
  style.textContent = styleText as any
  return style
}

console.log(
  "You may find that having is not so pleasing a thing as wanting. This is not logical, but it is often true."
)

const adapter = (wallet: string) =>
  new ActionConfig({
    signTransaction: (payload: TransactionPayload) =>
      chrome.runtime.sendMessage({
        type: "eth_sendTransaction",
        wallet,
        payload
      }),
    connect: () => chrome.runtime.sendMessage({ wallet, type: "connect" }),
    metadata: {}
  })

function initTwitterObserver() {
  chrome.runtime.sendMessage({ type: "getSelectedWallet" }, (wallet) => {
    if (wallet) {
      setupTwitterObserver(adapter(wallet))
    }
  })
}

initTwitterObserver()
