import { Beer } from 'lucide-react'

export function UsageSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Send USDT Directly
        </h2>
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <label
                htmlFor="wallet"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                {`Creator's Wallet Address`}
              </label>
              <input
                type="text"
                id="wallet"
                placeholder="Enter USDT wallet address"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Amount (USDT)
              </label>
              <input
                type="number"
                id="amount"
                placeholder="Enter amount"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button className="w-full px-6 py-3 text-lg font-medium bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors flex items-center justify-center">
              Buy a Beer <Beer className="ml-2 h-5 w-5" />
            </button>
            <p className="mt-4 text-sm text-gray-500 text-center">
              Payments are processed securely. The creator will receive USDT
              directly in their wallet.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
