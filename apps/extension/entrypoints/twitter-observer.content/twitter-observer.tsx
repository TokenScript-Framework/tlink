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
    const adapter = (wallet: string) =>
      new ActionConfig({
        signTransaction: (payload: any) =>
          chrome.runtime.sendMessage({
            type: "eth_sendTransaction",
            wallet,
            payload
          }),
        connect: () => chrome.runtime.sendMessage({ wallet, type: "connect" }),
        getConnectedAccount: () =>
          chrome.runtime.sendMessage({ wallet, type: "getConnectedAccount" }),
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
      chrome.runtime.sendMessage({ type: "getSelectedWallet" }, (wallet) => {
        if (wallet) {
          setupTwitterObserver(adapter(wallet))
        }
      })
    }

    initTwitterObserver()
  }, [])

  return (
    <Dialog open={open && !!dAppUrl} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px] h-[800px] p-0 no-scrollbar rounded-lg">
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
                  href={dAppUrl.replace("viewType=sts-token", "")}
                  target="_blank">
                  <SquareArrowUpRight className="h-6 w-6" />
                </a>
              </Button>
            </div>
          </div>

          {dAppUrl && (
            <TokenScriptIframe
              dAppUrl={dAppUrl}
              style={{ height: "calc(100% - 48px)" }}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
