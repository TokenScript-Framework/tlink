import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Tlink",
    host_permissions: [
      "https://twitter.com/*",
      "https://x.com/*"
      // "https://wallet.coinbase.com/*",
      // "https://opensea.io/assets/*"
    ],
    permissions: ["storage", "activeTab", "scripting"],
    web_accessible_resources: [
      {
        resources: ["sandbox.html"],
        matches: [
          "https://twitter.com/*",
          "https://x.com/*",
          "https://pro.x.com/*"
          // "https://wallet.coinbase.com/*",
          // "https://opensea.io/*"
        ]
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
      sandbox:
        "sandbox allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/ https://www.gstatic.com/ https://recaptcha.google.com/ https://challenges.cloudflare.com/; child-src 'self' https://viewer.tokenscript.org/ https://viewer-staging.tokenscript.org/ http://localhost:3333/ https://www.google.com/ https://challenges.cloudflare.com/; worker-src 'self' https://www.google.com/;"
    }
  },
  modules: ["@wxt-dev/module-react"]
})
