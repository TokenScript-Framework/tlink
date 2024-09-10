import { ActionConfig } from "@repo/tlinks"
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
console.log("content.ts")

const adapter = (wallet: string) =>
  new ActionConfig({
    signTransaction: (payload: any) =>
      chrome.runtime.sendMessage({
        type: "eth_sendTransaction",
        wallet,
        payload
      }),
    connect: () => chrome.runtime.sendMessage({ wallet, type: "connect" }),
    metadata: {}
  })

async function initTwitterObserver() {
  console.log("1111111111")
  chrome.runtime.sendMessage({ type: "getSelectedWallet" }, (wallet) => {
    console.log("2222222222", wallet)
    if (wallet) {
      console.log("33333333")
      console.log("setupTwitterObserver", wallet)
      setupTwitterObserver(adapter(wallet))
    }
  })
  console.log("44444444444")
}

initTwitterObserver()
