import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

function TestSandbox() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      HELLO SANDBOX new
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
      <iframe src="https://viewer.tokenscript.org/?viewType=sts-token&chain=137&contract=0xd5ca946ac1c1f24eb26dae9e1a53ba6a02bd97fe&tokenId=1649017156&tokenscriptUrl=https%3A%2F%2Fviewer.tokenscript.org%2Fassets%2Ftokenscripts%2Fsmart-cat-prod.tsml&chainId=137">
        <p>Your browser does not support iframes.</p>
      </iframe>
    </div>
  )
}

export default TestSandbox
