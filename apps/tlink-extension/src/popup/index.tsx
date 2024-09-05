import { useEffect, useState } from "react"

import { TokenScriptWebsite } from "~constant"
import { Header } from "~popup/components/Header"
import { WalletSelector } from "~popup/components/WalletSelector"

import "~style.css"

const Popup = () => {
  const [isLoading, setLoading] = useState(true)
  const [selectedWallet, setSelectedWallet] = useState<string | null>()

  useEffect(() => {
    chrome.storage.local.get(["selectedWallet"], (result) => {
      const storedWallet = result.selectedWallet ?? null
      setSelectedWallet(storedWallet)
      setLoading(false)
    })
  }, [])

  if (isLoading) return null
  return (
    <div className="h-[600px] w-[360px]">
      <div className="h-full flex flex-1 flex-col items-center px-4 pb-4">
        <Header />
        <div className="flex flex-col mt-20 items-center h-full">
          <h1 className="text-highlight font-bold mb-2">
            Enable TLinks-------------
          </h1>
          <p className="text-tertiary text-subtext mb-8 text-center font-normal">
            Choose a wallet you would like to enable TLinks for. What are
            TLinks?{" "}
            <button
              className="hover:underline text-primary"
              onClick={() => chrome.tabs.create({ url: TokenScriptWebsite })}>
              Learn More
            </button>
          </p>
          <WalletSelector
            selectedWallet={selectedWallet}
            setSelectedWallet={setSelectedWallet}
          />

          {/* {selectedWallet && (
          <div className="bg-accent-brand/10 rounded-lg p-2 flex items-center gap-2 w-full">
            <div className="flex-0 text-accent-brand">
              <CircleExclamationIcon />
            </div>
            <span className="text-caption font-normal text-start">
              Tlinks should only be enabled for one wallet at a time. Before
              enabling support here, be sure you haven’t enabled native Tlinks
              in any wallets.
            </span>
          </div>
        )} */}
        </div>
      </div>
    </div>
  )
}

export default Popup
