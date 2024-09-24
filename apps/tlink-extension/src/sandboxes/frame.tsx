import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"]
}

function TestSandbox() {
  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
      HELLO SANDBOX new
      <iframe
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
      </iframe>
    </div>
  )
}

export default TestSandbox
