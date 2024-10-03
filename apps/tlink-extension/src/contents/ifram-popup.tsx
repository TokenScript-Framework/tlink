import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import "~style.css"

import { Dialog, DialogContent } from "~components/dialog"

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
  const [open, setOpen] = useState(true)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // console.log(
      //   "tlink messaging 22222222222222222222",
      //   event.origin,
      //   event.data
      // )
      // The event.origin from frame.tsx is null

      if (event.data?.source === "tlink") {
        const resp = await chrome.runtime.sendMessage({
          type: "rpc",
          data: event.data.data
        })

        // console.log("tlink messaging 44444444444444444444", resp, event.data)
        sendResponse(event.data.data, resp)
      }

      function sendResponse(
        messageData: MessageEvent["data"],
        response: any | null
      ) {
        const data = messageData

        if (response?.error) {
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
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild>
          <button>hello</button>
        </DialogTrigger> */}
        <DialogContent className="sm:max-w-[425px] h-[800px] p-0 no-scrollbar">
          <iframe
            src={chrome.runtime.getURL("/sandboxes/frame.html")}
            ref={iframeRef}
            allow="clipboard-write"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
            className="w-full h-full no-scrollbar"
          />
        </DialogContent>
      </Dialog>
      <div className="z-50 flex fixed top-32 right-8 bg-gray-300 h-[800px]"></div>
    </>
  )
}

export default PlasmoOverlay
