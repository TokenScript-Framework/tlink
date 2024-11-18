import { ActionConfig, isTokenScriptViewerUrl } from "@repo/tlinks"
import { setupTwitterObserver } from "@repo/tlinks/ext/twitter"
import "@repo/tlinks/index.css"
import { useEffect, useState } from "react"
import "~/assets/style.css"
import {TokenscriptCardMetadata} from "@repo/tlinks/dist/utils/index";
import {AbstractActionComponent} from "@repo/tlinks/dist";

export const TwitterObserver = () => {
  const [dAppUrl, setDAppUrl] = useState("")
  const [tsMetadata, setTsMetadata] = useState<TokenscriptCardMetadata|undefined>(undefined)
  const iframePopupRef = useRef<IframePopupRef>(null)

  useEffect(() => {
    const adapter = () =>
      new ActionConfig({
        signTransaction: (payload: any) =>
          chrome.runtime.sendMessage({ type: "eth_sendTransaction", payload }),
        connect: () => chrome.runtime.sendMessage({ type: "connect" }),
        getConnectedAccount: () =>
          chrome.runtime.sendMessage({ type: "getConnectedAccount" }),
        interceptHandlePost: (component: AbstractActionComponent) => {
          if (isTokenScriptViewerUrl(component.href)) {
            setTsMetadata(component.tsMetadata as TokenscriptCardMetadata)
            setDAppUrl(component.href)
            iframePopupRef.current?.setOpen(true)
            return true
          } else {
            return false
          }
        },
        metadata: {},
        tsIframeRenderer: RendererTokenScriptIframe
      })

    async function initTwitterObserver() {
      setupTwitterObserver(adapter())
    }

    initTwitterObserver()
  }, [])

  return <IframePopup ref={iframePopupRef} dAppUrl={dAppUrl} tsMetadata={tsMetadata} />
}
