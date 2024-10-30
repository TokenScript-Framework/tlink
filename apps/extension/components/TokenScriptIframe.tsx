import { handleTlinkApiRequest } from "@/lib/handle-tlink-api"
import { useEffect, useRef } from "react"

export function TokenScriptIframe(props: {
  dAppUrl: string
  className?: string
  style?: React.CSSProperties
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // We only proxy messages that originate from the child iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return
      }

      if (event.data?.source === "TLINK_API_REQUEST") {
        iframeRef.current?.contentWindow?.postMessage(
          {
            type: "TLINK_API_RESPONSE",
            source: "TLINK_API_RESPONSE",
            data: {
              uid: event.data.data.uid,
              method: event.data.data.method,
              response: handleTlinkApiRequest(
                event.data.data.method,
                event.data.data.payload
              )
            }
          },
          "*"
        )
      }

      if (event.data?.source === "tlink") {
        const resp = await chrome.runtime.sendMessage({
          type: "rpc",
          data: event.data.data
        })

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
    <iframe
      src={chrome.runtime.getURL(
        `/sandbox.html?url=${encodeURIComponent(props.dAppUrl)}`
      )}
      ref={iframeRef}
      allow="clipboard-write"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      style={{ height: "100%", ...props.style }}
      className={`no-scrollbar w-full rounded-lg ${props.className}`}
    />
  )
}
