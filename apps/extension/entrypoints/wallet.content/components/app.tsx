import { GlobalApiSetup } from "@/entrypoints/wallet.content/components/global-api-setup"
import { TlinkLogo } from "@/entrypoints/wallet.content/components/tlink-logo"
import { config, handleApiResponse } from "@/entrypoints/wallet.content/wagmi"
import { WalletConnector } from "@/entrypoints/wallet.content/wallet-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { WagmiProvider } from "wagmi"

export function App() {
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
        <GlobalApiSetup />
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
