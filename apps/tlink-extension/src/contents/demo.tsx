import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      console.log(
        "tlink messaging 22222222222222222222",
        event.origin,
        event.data
      )
      // The event.origin from frame.tsx is null

      if (event.data?.source === "tlink") {
        console.log(
          "overlay-------",
          "Message received from iframe:",
          event.data
        )
        const resp = await chrome.runtime.sendMessage({
          type: "rpc",
          data: event.data.data
        })

        console.log("tlink messaging 44444444444444444444", resp)
        sendResponse(event.data, resp)
      }

      function sendResponse(messageData: MessageEvent["data"], response: any) {
        const data = messageData

        if (response.error) {
          data.error = response
        } else {
          data.result = response
        }

        iframeRef.current?.contentWindow?.postMessage(
          { source: "tlink-rpc-resp", data },
          "*"
        )
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="z-50 flex fixed top-32 right-8 bg-gray-300 h-[800px]">
      <iframe
        src={chrome.runtime.getURL("/sandboxes/frame.html")}
        ref={iframeRef}
      />
    </div>
  )
}

export default PlasmoOverlay
