import { getTwitterHandle } from "@/lib/get-twitter-handle"

export async function handleTlinkApiRequest(method: string, payload: any) {
  switch (method) {
    case "getTlinkContext":
      return {
        handle: getTwitterHandle(),
        API_KEY:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoibXVsdGktY2hhbm5lbC1yZW5kZXJpbmctdGxpbmsiLCJpYXQiOjE3MjcxNzE1MDl9.9864en0XJbVgzACE_gHrQ00mr6fgctNRXWZ0Nex3DcQ"
      }
    case "getTurnstileToken":
    case "getRecaptchaToken":
     /*return await chrome.runtime.sendMessage({
        type: "TLINK_API_REQUEST",
        method,
        payload
      })*/
      return await handleTlinkApiViaTSViewerWindow(method, payload);
  }

  return null
}

async function handleTlinkApiViaTSViewerWindow(method: string, payload: any){

    return new Promise(async (resolve, reject) => {

        let popup: WindowProxy|null;
        let closedTimer;

        const requestUrl = `http://localhost:3333/?viewType=tlink-api&method=${method}&payload=${encodeURIComponent(JSON.stringify(payload))}`

        function handleMessage(event: MessageEvent){

            if (event.source !== popup || event.data.type !== "TLINK_API_RESPONSE") {
                return
            }

            if (closedTimer)
                clearInterval(closedTimer)

            if (event.data.response){
                resolve(event.data.response);
            } else {
                reject(new Error(event.data.error));
            }

            popup?.close();
        }

        window.addEventListener("message", handleMessage);

        popup = popupCenter(requestUrl, "TLink Request", 400, 400);

        if (!popup)
            reject(new Error("Failed to open the popup window"));

        closedTimer = setInterval(() => {
            if (!popup || popup.closed){
                reject(new Error("Popup closed"));
            }
        }, 1000)

    });
}

function popupCenter (url, title, w, h) {
    const left = (screen.width/2)-(w/2);
    const top = (screen.height/2)-(h/2);
    return window.open(url, title, 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=yes, copyhistory=no, width='+w+', height='+h+', top='+top+', left='+left);
}
