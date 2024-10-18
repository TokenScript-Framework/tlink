import { TestWallet } from "@/entrypoints/wallet.content/test-wallet"
import { config, handleApiResponse } from "@/entrypoints/wallet.content/wagmi"
import { WalletConnector } from "@/entrypoints/wallet.content/wallet-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import React, { useState } from "react"
import * as ReactDOM from "react-dom/client"
import { WagmiProvider } from "wagmi"

const Wallet = () => {
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
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "400px",
            height: "400px",
            background: "red",
            color: "white"
          }}>
          <TestWallet />
          <WalletConnector />
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

function App() {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "300px",
        height: "300px",
        backgroundColor: "red"
      }}>
      <Wallet />
    </div>
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
