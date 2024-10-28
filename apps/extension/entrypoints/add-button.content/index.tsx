import { EntryButton } from "@/entrypoints/add-button.content/components/entry-button"
import { SparklesIcon } from "lucide-react"
import ReactDOM from "react-dom/client"

const list = [
  {
    url: "https://wallet.coinbase.com/assets/nft",
    targetDiv: '[data-testid="collectible-detail-commerce-button-bar"]',
    Component: (props: { openIframe: () => void }) => (
      <div className="min-w-[60px] flex flex-col items-center justify-center gap-2">
        <button
          className="w-10 h-10 flex items-center justify-center bg-[#EEF0F3] hover:bg-[#E9EBEE] rounded-full"
          type="button"
          onClick={() => props.openIframe()}>
          <SparklesIcon className="h-5 w-5" />
        </button>
        <p className="text-[13px]">Tapp</p>
      </div>
    ),
    parseTokenUrl: () => {
      const parsedUrl = new URL(window.location.href)
      const pathParts = parsedUrl.pathname
        .replace("/assets/nft/", "")
        .split("/")

      return {
        contractAddress: pathParts[0],
        tokenId: pathParts[1],
        chainId: parsedUrl.searchParams.get("chainId") || ""
      }
    }
  },
  {
    url: "https://opensea.io/assets/",
    targetDiv: ".item--collection-toolbar-wrapper div:first-child",
    Component: (props: { openIframe: () => void }) => (
      <div className="min-w-[60px] flex flex-col items-center justify-center gap-2">
        <button
          className="w-10 h-10 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-500 rounded-full"
          type="button"
          onClick={() => props.openIframe()}>
          <SparklesIcon className="h-5 w-5" />
        </button>
      </div>
    ),
    parseTokenUrl: () => {
      const parsedUrl = new URL(window.location.href)
      const pathParts = parsedUrl.pathname
        .replace("/assets/matic/", "")
        .split("/")

      return {
        contractAddress: pathParts[0],
        tokenId: pathParts[1],
        chainId: "137" // TODO:
      }
    }
  }
]

export default defineContentScript({
  matches: [
    "https://wallet.coinbase.com/assets/nft/*",
    "https://opensea.io/assets/*"
  ],
  runAt: "document_end",

  main(ctx) {
    let hasRendered = false
    const startObserving = () => {
      const observer = new MutationObserver((mutations) => {
        if (hasRendered) return
        const target = list.find((t) => location.href.includes(t.url))
        if (target) {
          const targetDiv = document.querySelector(target.targetDiv)
          if (targetDiv) {
            const newContent = document.createElement("div")

            const root = ReactDOM.createRoot(newContent)
            const Component = target.Component
            root.render(
              <EntryButton {...target.parseTokenUrl()} children={Component} />
            )

            targetDiv.appendChild(newContent)
            // Once we've found and modified the target, we can disconnect the observer
            observer.disconnect()
            hasRendered = true
          }
        } else {
          observer.disconnect()
        }
      })

      // Start observing the document with the configured parameters
      observer.observe(document.body, { childList: true, subtree: true })

      return observer
    }

    // Initial observation
    let currentObserver = startObserving()

    // Listen for URL changes
    const urlObserver = new MutationObserver(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href

        // Disconnect the previous observer
        currentObserver.disconnect()

        // Start a new observation
        currentObserver = startObserving()
      }
    })

    let lastUrl = location.href
    const body = document.querySelector("body")
    if (body) {
      urlObserver.observe(body, { childList: true, subtree: true })
    }
  }
})
