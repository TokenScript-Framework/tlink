import { Header } from "@/entrypoints/popup/components/Header"
import { TokenScriptWebsite } from "@/lib/constant"

const App = () => {
  return (
    <div className="h-[600px] w-[360px]">
      <div className="h-full flex flex-1 flex-col items-center px-4 pb-4">
        <Header />
        <div className="flex flex-col mt-20 items-center h-full">
          <h1 className="text-highlight font-bold mb-2">Enable TLinks</h1>
          <p className="text-tertiary text-subtext mb-8 text-center font-normal">
            What are TLinks?{" "}
            <button
              className="hover:underline text-primary"
              onClick={() => chrome.tabs.create({ url: TokenScriptWebsite })}>
              Learn More
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
