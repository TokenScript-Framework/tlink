import { defineConfig } from "wxt"

// See https://wxt.dev/api/config.html
export default defineConfig({
  manifest: {
    name: "Tlink",
    host_permissions: ["https://twitter.com/*", "https://x.com/*"],
    permissions: ["storage", "activeTab", "scripting"],
    web_accessible_resources: [
      {
        resources: ["sandbox.html"],
        matches: [
          "https://twitter.com/*",
          "https://x.com/*",
          "https://pro.x.com/*"
        ]
      }
    ],
    content_security_policy: {
      extension_pages: "script-src 'self'; object-src 'self';",
      sandbox:
        "sandbox allow-scripts allow-forms allow-popups allow-modals; script-src 'self' 'unsafe-inline' 'unsafe-eval'; child-src 'self' https://viewer.tokenscript.org/ https://viewer-staging.tokenscript.org/;"
    }
  },
  modules: ["@wxt-dev/module-react"]
})
