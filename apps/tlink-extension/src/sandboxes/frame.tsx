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
    const handleMessage = async (event: MessageEvent) => {
      // The event.origin is null
      console.log("tlink messaging 11111111111111111", {
        event,
        "window-ethereum": window.ethereum,
        "chrome-runtime": chrome.runtime
      })
      // here we can't use chrome.runtime.sendMessage, it's undefined
      // window.ethereum is also undefined
      if (event.data.source === "tlink-rpc-resp") {
        console.log(
          "WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW succceeeddddddddddddddd!!!!!!!!!",
          event.data
        )
        iframeRef.current?.contentWindow?.postMessage(event.data.data, "*")
      } else {
        window.parent.postMessage({ source: "tlink", data: event.data }, "*")
      }
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
        ref={iframeRef}
        style={{ height: "100%" }}
        src={dAppUrl}
        className="relative size-full"
        allow="clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
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
