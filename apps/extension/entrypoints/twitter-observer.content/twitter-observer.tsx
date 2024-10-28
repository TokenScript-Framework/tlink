import { ActionConfig } from "@repo/tlinks"
import { setupTwitterObserver } from "@repo/tlinks/ext/twitter"
import "@repo/tlinks/index.css"
import { useEffect, useState } from "react"
import "~/assets/style.css"

export const TwitterObserver = () => {
  const [dAppUrl, setDAppUrl] = useState("")
  const iframePopupRef = useRef<IframePopupRef>(null)

  useEffect(() => {
    const adapter = () =>
      new ActionConfig({
        signTransaction: (payload: any) =>
          chrome.runtime.sendMessage({
            type: "eth_sendTransaction",
            payload
          }),
        connect: () => chrome.runtime.sendMessage({ type: "connect" }),
        getConnectedAccount: () =>
          chrome.runtime.sendMessage({ type: "getConnectedAccount" }),
        interceptHandlePost: (href) => {
          if (href.includes("tokenscript.org")) {
            setDAppUrl(href)
            iframePopupRef.current?.setOpen(true)
            return true
          } else {
            return false
          }
        },
        metadata: {}
      })

    async function initTwitterObserver() {
      setupTwitterObserver(adapter())
    }

    initTwitterObserver()
  }, [])

  return <IframePopup ref={iframePopupRef} dAppUrl={dAppUrl} />
}
