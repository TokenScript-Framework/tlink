import { useIframePostMessage } from '@/hooks/use-iframe-post-message'
import { useRef } from 'react'

export function TokenScriptIframe(props: {
  dAppUrl: string
  className?: string
  style?: React.CSSProperties
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useIframePostMessage(iframeRef, props.dAppUrl)

  return (
    <iframe
      src={props.dAppUrl}
      ref={iframeRef}
      allow="clipboard-write"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-modals"
      style={{ height: '100%', ...props.style }}
      className={`no-scrollbar w-full bg-white rounded-lg ${props.className}`}
    />
  )
}
