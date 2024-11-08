import { GlobalApiSetup } from "@/entrypoints/wallet.content/components/global-api-setup"
import { TlinkLogo } from "@/entrypoints/wallet.content/components/tlink-logo"
import { config, handleApiResponse } from "@/entrypoints/wallet.content/wagmi"
import { WalletConnector } from "@/entrypoints/wallet.content/wallet-connector"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"
import { WagmiProvider } from "wagmi"

export function App() {
  const [isOpen, setIsOpen] = useState(false)
  const [queryClient] = useState(() => new QueryClient())
  const [position, setPosition] = useState(() => {
    const saved = localStorage.getItem("tlink-button-position")
    return saved ? JSON.parse(saved) : { bottom: 16, right: 16 }
  })

  const [dragImage] = useState(() => {
    const img = new Image()
    img.src =
      "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
    img.style.display = "none"
    return img
  })

  useEffect(() => {
    window.addEventListener("message", handleApiResponse)
    return () => {
      window.removeEventListener("message", handleApiResponse)
    }
  }, [])

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setDragImage(dragImage, 0, 0)
  }

  const handleDrag = (e: React.DragEvent) => {
    if (e.clientY === 0) return

    const viewportHeight = window.innerHeight
    const buttonSize = 64 // 16 * 4 (w-16)

    const newPosition = {
      bottom: Math.max(0, viewportHeight - e.clientY - buttonSize / 2),
      right: 16
    }

    setPosition(newPosition)
    localStorage.setItem("tlink-button-position", JSON.stringify(newPosition))
  }

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <GlobalApiSetup />
        <button
          type="button"
          draggable
          onDragStart={handleDragStart}
          onDrag={handleDrag}
          onClick={() => setIsOpen(true)}
          style={{
            bottom: `${position.bottom}px`,
            right: 16
          }}
          className="fixed w-16 h-16 shadow-lg rounded-full bg-white z-[1000] border flex items-center justify-center">
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
