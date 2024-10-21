import { TlinkLogo } from "@/entrypoints/wallet.content/components/tlink-logo"
import { config, handleApiResponse } from "@/entrypoints/wallet.content/wagmi"
import { WalletConnector } from "@/entrypoints/wallet.content/wallet-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import * as ReactDOM from "react-dom/client"
import { WagmiProvider } from "wagmi"

function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [queryClient] = useState(() => new QueryClient())
  useEffect(() => {
    window.addEventListener("message", handleApiResponse)
    return () => {
      window.removeEventListener("message", handleApiResponse)
    }
  }, [])

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-4 right-4 w-16 h-16 shadow-lg rounded-full bg-white z-[1000] border flex items-center justify-center">
          <TlinkLogo className="w-7 h-7 ml-1 mb-1" />
        </button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-gray-200">
            <WalletConnector />
          </DialogContent>
        </Dialog>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default defineContentScript({
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"],
  world: "MAIN",

  main() {
    // Create a new div element
    const container = document.createElement("div")
    container.id = "tlink-app-container"
    document.body.appendChild(container)

    // Create a root and render the App component
    const root = ReactDOM.createRoot(container)
    root.render(<App />)

    // Return a cleanup function
    return () => {
      root.unmount()
      container.remove()
    }
  }
})
