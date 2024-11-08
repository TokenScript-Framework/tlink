import { App } from "@/entrypoints/wallet.content/components/app"
import { sendApiRequest } from "@/entrypoints/wallet.content/wagmi"
import * as ReactDOM from "react-dom/client"

export default defineContentScript({
  matches: [
    "https://twitter.com/*",
    "https://x.com/*",
    "https://pro.x.com/*"
    // "https://wallet.coinbase.com/assets/nft/*",
    // "https://opensea.io/assets/*"
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
        if (args[0].startsWith("https://chain-proxy.wallet.coinbase.com")) {
          const decoded = JSON.parse(args[1].body)

          try {
            const result = await sendApiRequest(
              args[0],
              decoded.method,
              decoded.params
            )

            //if (result.error)
            //throw result.error;

            return {
              ok: true,
              status: 200,
              json: () => {
                return result
              }
            } as Response
          } catch (error) {
            console.log("RPC Error: ", error)

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

        return target.apply(that, args)
      }
    })

    // Return a cleanup function
    return () => {
      root.unmount()
      container.remove()
    }
  }
})
