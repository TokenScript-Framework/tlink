import cssText from "data-text:~style.css"
import type { PlasmoCSConfig } from "plasmo"
import { useEffect } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const PlasmoOverlay = () => {
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
      }
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <div className="z-50 flex fixed top-32 right-8 bg-gray-300 h-[800px]">
      <iframe src={chrome.runtime.getURL("/sandboxes/frame.html")} />
    </div>
  )
}

export default PlasmoOverlay
