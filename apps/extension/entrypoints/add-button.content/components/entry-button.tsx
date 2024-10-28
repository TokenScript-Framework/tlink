import {
  IframePopup,
  IframePopupRef
} from "@/entrypoints/add-button.content/components/iframe-popup"
import { fetchScriptUri } from "@/entrypoints/add-button.content/lib/fetch-scripturi"
import "@repo/tlinks/index.css"
import { useState } from "react"
import "~/assets/style.css"

export const EntryButton = (props: {
  contractAddress: string
  tokenId: string
  chainId: string
  children: (props: { openIframe: () => void }) => React.ReactNode
}) => {
  const [dAppUrl, setDAppUrl] = useState("")
  const iframePopupRef = useRef<IframePopupRef>(null)

  useEffect(() => {
    const { contractAddress, tokenId, chainId } = props

    fetchScriptUri(contractAddress, Number(chainId)).then((scriptUri) => {
      const dAppUrl = toDAppUrl(scriptUri, chainId, contractAddress, tokenId)
      setDAppUrl(dAppUrl)
    })
  }, [])

  return (
    <>
      {props.children({
        openIframe: () => iframePopupRef.current?.setOpen(true)
      })}
      <IframePopup ref={iframePopupRef} dAppUrl={dAppUrl} />
    </>
  )
}

function toDAppUrl(
  scriptURI: string | null | undefined,
  chainId: string,
  contractAddress: string,
  tokenId: string
) {
  return scriptURI
    ? addQueriesToUrl(
        isTokenScriptFile(scriptURI)
          ? `${"https://viewer-staging.tokenscript.org/"}?viewType=sts-token&chain=${chainId}&contract=${contractAddress}&tokenId=${tokenId}&tokenscriptUrl=${encodeURIComponent(
              scriptURI
            )}`
          : scriptURI,
        { chainId: chainId, contract: contractAddress, tokenId: tokenId }
      )
    : ""

  function addQueriesToUrl(
    url: string,
    params: { [key: string]: string }
  ): string {
    const result = new URL(url)
    Object.entries(params).forEach(([key, value]) => {
      result.searchParams.set(key, value)
    })
    return result.toString()
  }

  function isTokenScriptFile(url: string) {
    // for some urls, it had query in URL to bust cache
    return url.includes(".tsml")
  }
}
