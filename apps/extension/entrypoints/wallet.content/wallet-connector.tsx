import { Card } from "@/components/card"
import { CoinbaseLogo } from "@/components/coinbase-logo"

export const WalletConnector = () => {
  return (
    <Card className="w-full max-w-md p-6 bg-white rounded-3xl shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Connect wallet
      </h2>
      <div className="space-y-4">
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal h-16">
          <div className="flex items-center gap-3">
            <MetaMaskLogo className="w-7 h-7" />
            <span className="text-lg text-[#383c48]">MetaMask</span>
          </div>
          <span className="text-sm text-blue-600">Last used</span>
        </Button>
        <Button
          variant="outline"
          className="w-full justify-between text-left font-normal h-16">
          <div className="flex items-center gap-3">
            <CoinbaseLogo className="w-7 h-7" />
            <span className="text-lg text-[#383c48]">Coinbase</span>
          </div>
          <span className="text-sm text-blue-600">Multichain</span>
        </Button>
      </div>
      <div className="mt-6 text-center text-sm text-gray-500">
        Powered by <span className="font-semibold">tlink</span>
      </div>
    </Card>
  )
}
