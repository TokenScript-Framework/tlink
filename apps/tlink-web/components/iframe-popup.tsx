import { TokenScriptIframe } from '@/components/TokenScriptIframe'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'
import '@repo/tlinks/index.css'
import { CircleX, SquareArrowUpRight } from 'lucide-react'
import { forwardRef, useImperativeHandle, useState } from 'react'
import {TokenscriptCardMetadata} from "@repo/tlinks/dist/utils/index";

export interface IframePopupRef {
  setOpen: (open: boolean) => void
}

export const IframePopup = forwardRef<IframePopupRef, { dAppUrl: string, tsMetadata?: TokenscriptCardMetadata }>(
  (props, ref) => {
    const [open, setOpen] = useState(false)

    useImperativeHandle(ref, () => ({
      setOpen,
    }))

    return (
      <Dialog open={open && !!props.dAppUrl} onOpenChange={setOpen}>
        <VisuallyHidden>
          <DialogContent
            className={(props.tsMetadata?.fullScreen ? "h-[85%] w-[95%] max-w-[95%]" : "max-w-xl h-[800px]") + " p-0 no-scrollbar rounded-lg max-h-[90%]"}
            aria-description="iframe"
          >
            <DialogTitle className="hidden">iframe</DialogTitle>
            <div className="rounded-lg overflow-hidden">
              <div className="w-full h-12 px-2 flex justify-between items-center text-black bg-white">
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  size="icon"
                  className="focus-visible:ring-0 focus-visible:ring-ring border-none shadow-none"
                >
                  <CircleX className="h-6 w-6" />
                </Button>

                <div>
                  <Button
                    variant="outline"
                    size="icon"
                    className="focus-visible:ring-0 focus-visible:ring-ring border-none shadow-none"
                    asChild
                  >
                    <a
                      href={props.dAppUrl.replace('viewType=tlink-card', '')}
                      target="_blank"
                    >
                      <SquareArrowUpRight className="h-6 w-6" />
                    </a>
                  </Button>
                </div>
              </div>

              {props.dAppUrl && (
                <TokenScriptIframe
                  dAppUrl={props.dAppUrl}
                  style={{ height: 'calc(100% - 45px)' }}
                />
              )}
            </div>
          </DialogContent>
        </VisuallyHidden>
      </Dialog>
    )
  },
)

IframePopup.displayName = 'IframePopup'
