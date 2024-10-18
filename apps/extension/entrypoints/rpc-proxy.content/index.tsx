export default defineContentScript({
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"],

  main() {
    window.addEventListener("message", async (event) => {
      if (event.data.type === "TLINK_RPC_PROXY_REQ") {
        const data = event.data as {
          type: "TLINK_RPC_PROXY_REQ"
          requestId: string
          url: string
          method: string
          params?: any
        }

        try {
          const response = await fetch(data.url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              jsonrpc: "2.0",
              id: data.requestId,
              method: data.method,
              params: data.params
            })
          })

          const result = await response.json()

          window.postMessage({
            type: "TLINK_RPC_PROXY_RSP",
            requestId: data.requestId,
            response: result
          })
        } catch (error) {
          window.postMessage({
            type: "TLINK_RPC_PROXY_RSP",
            requestId: data.requestId,
            error: (error as Error).message
          })
        }
      }
    })
  }
})
