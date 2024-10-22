import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { ActionConfig, TokenScriptIframe } from "@repo/tlinks"
import { setupTwitterObserver } from "@repo/tlinks/ext/twitter"
import "@repo/tlinks/index.css"
import { CircleX, SquareArrowUpRight } from "lucide-react"
import { useEffect, useState } from "react"
import "~/assets/style.css"

export const TwitterObserver = () => {
  const [open, setOpen] = useState(false)
  const [dAppUrl, setDAppUrl] = useState("")

  useEffect(() => {
    const adapter = () =>
      new ActionConfig({
        signTransaction: (payload: any) =>
          chrome.runtime.sendMessage({
            type: "eth_sendTransaction",
            payload
          }),
        connect: () => chrome.runtime.sendMessage({ type: "connect" }),
        getConnectedAccount: () =>
          chrome.runtime.sendMessage({ type: "getConnectedAccount" }),
        interceptHandlePost: (href) => {
          if (href.includes("tokenscript.org")) {
            setDAppUrl(href)
            setOpen(true)
            return true
          } else {
            return false
          }
        },
        metadata: {}
      })

    async function initTwitterObserver() {
      setupTwitterObserver(adapter())
    }

    initTwitterObserver()
  }, [])

  return (
    <Dialog open={open && !!dAppUrl} onOpenChange={setOpen}>
      <VisuallyHidden>
        <DialogContent
          className="max-w-[460px] h-[800px] p-0 no-scrollbar rounded-lg"
          aria-description="iframe">
          <DialogTitle className="hidden">iframe</DialogTitle>
          <div className="rounded-lg overflow-hidden">
            <div className="w-full h-12 px-2 flex justify-between items-center text-black">
              <Button
                onClick={() => setOpen(false)}
                variant="outline"
                size="icon"
                className="focus-visible:ring-0 focus-visible:ring-ring border-none shadow-none">
                <CircleX className="h-6 w-6" />
              </Button>

              <div>
                <Button
                  variant="outline"
                  size="icon"
                  className="focus-visible:ring-0 focus-visible:ring-ring border-none shadow-none"
                  asChild>
                  <a
                    href={dAppUrl.replace("viewType=tlink-card", "")}
                    target="_blank">
                    <SquareArrowUpRight className="h-6 w-6" />
                  </a>
                </Button>
              </div>
            </div>

            {dAppUrl && (
              <TokenScriptIframe
                dAppUrl={dAppUrl}
                style={{ height: "calc(100% - 45px)" }}
              />
            )}
          </div>
        </DialogContent>
      </VisuallyHidden>
    </Dialog>
  )
}
