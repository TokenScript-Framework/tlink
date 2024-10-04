import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

function Sandbox() {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [dAppUrl, setDappUrl] = useState("")

  useEffect(() => {
    const url = new URL(window.location.href)
    const dAppUrl = url.searchParams.get("url")
    setDappUrl(dAppUrl)
  }, [])

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // The event.origin is null
      // console.log("tlink messaging 11111111111111111", { event, })
      // here we can't use chrome.runtime.sendMessage, it's undefined
      // window.ethereum is also undefined
      if (event.data.source === "tlink-rpc-resp") {
        // forward the message to TS viewer
        iframeRef.current?.contentWindow?.postMessage(event.data.data, "*")
      } else {
        // forward the message from TS viewer to upper iframe
        window.parent.postMessage({ source: "tlink", data: event.data }, "*")
      }
    }
    window.addEventListener("message", handleMessage)

    return () => window.removeEventListener("message", handleMessage)
  }, [])

  useGlobalStyle()

  return (
    <div style={{ height: "800px" }}>
      {dAppUrl && (
        <iframe
          key={dAppUrl}
          ref={iframeRef}
          style={{ height: "100%", width: "100%", borderWidth: 0 }}
          src={dAppUrl}
          className="relative size-full"
          allow="clipboard-write"
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
        />
      )}
    </div>
  )
}

export default Sandbox

function useGlobalStyle() {
  useEffect(() => {
    // Add global CSS
    const style = document.createElement("style")
    style.textContent = `
      body {
        margin: 0;
        padding: 0;
        overflow: hidden;
      }
    `
    document.head.appendChild(style)

    return () => {
      document.head.removeChild(style)
    }
  }, [])
}
