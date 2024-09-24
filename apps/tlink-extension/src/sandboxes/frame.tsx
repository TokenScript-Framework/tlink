import type { PlasmoCSConfig } from "plasmo"
import { useRef, useState } from "react"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

function TestSandbox() {
  const chainId = 137
  const appIndex = 0

  const scriptURI =
    "https://viewer.tokenscript.org/assets/tokenscripts/smart-cat-prod.tsml"
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const dAppUrl = `https://viewer.tokenscript.org/?viewType=sts-token&chain=137&contract=0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe&tokenId=1649017156&tokenscriptUrl=https%3A%2F%2Fviewer.tokenscript.org%2Fassets%2Ftokenscripts%2Fsmart-cat-prod.tsml&chainId=137`

  return (
    <div style={{ height: "800px" }}>
      here we have useRef
      <TestButton />
      {/* <iframe
        srcDoc={`
        <p>Hello world srcdoc!</p>
        <script>
          document.body.style.backgroundColor = 'lightblue';
          setInterval(() => {
            document.body.style.backgroundColor =
              document.body.style.backgroundColor === 'lightblue' ? 'lightgreen' : 'lightblue';
          }, 2000);
        </script>
      `}>
        <p>Your browser does not support iframes.</p>
      </iframe> */}
      {/* <iframe
        style={{ height: "100%" }}
        src="https://viewer.tokenscript.org/?viewType=sts-token&chain=137&contract=0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe&tokenId=1649017156&tokenscriptUrl=https%3A%2F%2Fviewer.tokenscript.org%2Fassets%2Ftokenscripts%2Fsmart-cat-prod.tsml&chainId=137">
        <p>Your browser does not support iframes.</p>
      </iframe> */}
      <iframe
        // key={`${chainId}-${contract}-${tokenId}-${address}`}
        style={{ height: "100%" }}
        src={dAppUrl}
        className="relative size-full"
        allow="clipboard-write"></iframe>
    </div>
  )
}

export default TestSandbox

function TestButton() {
  const [count, setCount] = useState(0)
  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>
}
