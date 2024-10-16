import { TwitterObserver } from "@/entrypoints/twitter-observer.content/twitter-observer"
import ReactDOM from "react-dom/client"

export default defineContentScript({
  matches: ["https://twitter.com/*", "https://x.com/*", "https://pro.x.com/*"],

  main(ctx) {
    const ui = createIntegratedUi(ctx, {
      position: "overlay",
      onMount: (container) => {
        // Create a root on the UI container and render a component
        const root = ReactDOM.createRoot(container)
        root.render(<TwitterObserver />)
        return root
      },
      onRemove: (root) => {
        // Unmount the root when the UI is removed
        root?.unmount()
      }
    })

    // Call mount to add the UI to the DOM
    ui.mount()
  }
})
