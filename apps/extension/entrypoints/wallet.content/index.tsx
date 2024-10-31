import { GlobalApiSetup } from "@/entrypoints/wallet.content/components/global-api-setup"
import { TlinkLogo } from "@/entrypoints/wallet.content/components/tlink-logo"
import {config, handleApiResponse, sendApiRequest} from "@/entrypoints/wallet.content/wagmi"
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

export default defineContentScript({
  matches: [
    "https://twitter.com/*",
    "https://x.com/*",
    "https://pro.x.com/*",
    "https://wallet.coinbase.com/assets/nft/*",
    "https://opensea.io/assets/*"
  ],
  world: "MAIN",

  main() {
    // Create a new div element
    const container = document.createElement("div")
    container.id = "tlink-app-container"
    document.body.appendChild(container)

    // Create a root and render the App component
    const root = ReactDOM.createRoot(container)
    root.render(<App />)

    window.fetch = new Proxy(window.fetch, {
      apply: async function (target, that, args) {

        // Route RPC request for coinbase smartwallet through the extension transport interface.
        // It can't be done with custom wagmi transport as it's not used by the coinbase SDK.
        if (args[0].startsWith("https://chain-proxy.wallet.coinbase.com")){
          const decoded = JSON.parse(args[1].body);
          console.log("REQUEST INTERCEPTED!", args, decoded);
          try {
            const result = await sendApiRequest(args[0], decoded.method, decoded.params);
            console.log("Response: ", result)

            //if (result.error)
              //throw result.error;

            return {
              ok: true,
              status: 200,
              json: () => {
                return result;
              }
            } as Response

          } catch (error) {

            console.log("RPC Error: ", error);

            return {
              ok: true,
              status: 200,
              json: () => {
                return {
                  ...decoded,
                  error
                }
              }
            }
          }
        }

        return target.apply(that, args);
      }
    });

    // Return a cleanup function
    return () => {
      root.unmount()
      container.remove()
    }
  }
})
