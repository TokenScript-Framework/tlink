/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useRef } from 'react';

// TODO: remove chrome API and pass the API in

export function TokenScriptIframe(props: {
  dAppUrl: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
      // console.log(
      //   "tlink messaging 22222222222222222222",
      //   event.origin,
      //   event.data
      // )
      // The event.origin from frame.tsx is null

      // We only proxy messages that originate from the child iframe
      if (event.source !== iframeRef.current?.contentWindow) {
        return;
      }

      if (event.data?.source === 'tlink') {
        // @ts-expect-error
        const resp = await chrome.runtime.sendMessage({
          type: 'rpc',
          data: event.data.data,
        });

        // console.log("tlink messaging 44444444444444444444", resp, event.data)
        sendResponse(event.data.data, resp);
      }

      function sendResponse(
        messageData: MessageEvent['data'],
        response: any | null,
      ) {
        const data = messageData;

        if (response?.error) {
          data.error = response;
        } else {
          data.result = response;
        }

        iframeRef.current?.contentWindow?.postMessage(
          { source: 'tlink-rpc-resp', data },
          '*',
        );
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  return (
    <iframe
      // @ts-expect-error
      src={chrome.runtime.getURL(
        `/sandbox.html?url=${encodeURIComponent(props.dAppUrl)}`,
      )}
      ref={iframeRef}
      allow="clipboard-write"
      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      style={{ height: '100%', ...props.style }}
      className={`no-scrollbar w-full rounded-lg ${props.className}`}
    />
  );
}
