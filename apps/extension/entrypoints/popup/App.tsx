import { Header } from "@/entrypoints/popup/components/Header"
import { Preview } from "@/entrypoints/popup/components/preview"

const App = () => {
  return (
    <div className="h-[600px] w-[360px] bg-[#F8F9FA]">
      <div className="h-full flex flex-1 flex-col items-center px-4 pb-4">
        <Header />
        <div className="flex flex-col mt-10 items-center h-full">
          <Preview />
        </div>
      </div>
    </div>
  )
}

export default App
