import cssText from "data-text:~style.css"
import { CircleX, SquareArrowUpRight } from "lucide-react"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useRef, useState } from "react"

import { Button } from "~components/button"
import { Dialog, DialogContent } from "~components/dialog"

import "~style.css"

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

  const dAppUrl =
    "https://viewer.tokenscript.org/?viewType=sts-token&chain=137&contract=0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe&tokenId=1649017156&chainId=137"

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px] h-[800px] p-0 no-scrollbar rounded-lg">
          <div className="rounded-lg overflow-hidden">
            <div className="w-full h-12 px-2 flex justify-between items-center">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                size="icon"
                className="focus-visible:ring-0 focus-visible:ring-ring border-none shadow-none">
                <CircleX className="h-6 w-6" />
              </Button>

              <div>
                <Button
                  variant="outline"
                  size="icon"
                  className="focus-visible:ring-0 focus-visible:ring-ring border-none shadow-none">
                  <SquareArrowUpRight className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <iframe
              src={chrome.runtime.getURL(
                `/sandboxes/frame.html?url=${encodeURIComponent(dAppUrl)}`
              )}
              ref={iframeRef}
              allow="clipboard-write"
              sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
              className="w-full h-full no-scrollbar rounded-lg"
            />
          </div>
        </DialogContent>
      </Dialog>
      <div className="z-50 flex fixed top-32 right-8 bg-gray-300 h-[800px]"></div>
    </>
  )
}

export default PlasmoOverlay
