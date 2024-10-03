import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

function TestSandbox() {
  const chainId = 137
  const appIndex = 0

  const scriptURI =
    "https://viewer.tokenscript.org/assets/tokenscripts/smart-cat-prod.tsml"
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const dAppUrl = `https://viewer.tokenscript.org/?viewType=sts-token&chain=137&contract=0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe&tokenId=1649017156&chainId=137`

  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      // if (event.origin !== "https://trusted-domain.com") return;
      console.log("extension iframe ------------event", e)
      console.log(
        "extension iframe ------------window.ethereum",
        // @ts-ignore
        window.ethereum
      )
      console.log("chrome.runtime", chrome.runtime)
      // here we can't use chrome.runtime.sendMessage
      window.parent.postMessage({ source: "tlink", data: e.data }, "*")
    }

    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  }, [])

  return (
    <div style={{ height: "800px" }}>
      here we have useRef
      <TestButton />
      <iframe
        // key={`${chainId}-${contract}-${tokenId}-${address}`}
        style={{ height: "100%" }}
        src={dAppUrl}
        className="relative size-full"
        allow="clipboard-write"
        sandbox="allow-same-origin allow-scripts"
      />
    </div>
  )
}

export default TestSandbox

function TestButton() {
  const [count, setCount] = useState(100)
  console.log("count", count)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
