import { ActionConfig, isTokenScriptViewerUrl } from "@repo/tlinks"
import { setupTwitterObserver } from "@repo/tlinks/ext/twitter"
import "@repo/tlinks/index.css"
import { useEffect, useState } from "react"
import "~/assets/style.css"
import {AbstractActionComponent, TokenscriptCardMetadata} from "@repo/tlinks";
import {openTsPopupWindow} from "@/lib/open-ts-popup-window";

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
        interceptHandlePost: async (component: AbstractActionComponent) => {
          if (isTokenScriptViewerUrl(component.href)) {

            const options = await chrome.storage.sync.get({ use_popup_window: false });

            if (options.use_popup_window){
                openTsPopupWindow(component.href, component.tsMetadata);
            } else {
                setTsMetadata(component.tsMetadata as TokenscriptCardMetadata)
                setDAppUrl(component.href)
                iframePopupRef.current?.setOpen(true)
            }

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
