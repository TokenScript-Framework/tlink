import {handleTlinkApiRequest, popupCenter} from "@/lib/handle-tlink-api.ts";
import {TokenscriptCardMetadata} from "@repo/tlinks/src";

export function openTsPopupWindow(dAppUrl: string, tsMetadata: TokenscriptCardMetadata){

	let popup;

	const handleMessage = async (event: MessageEvent) => {

		// We only proxy messages that originate from the child iframe
		if (!popup || event.source !== popup) {
			return
		}

		console.log("Processing message from popup", event, popup);

		if (event.data?.type === "TLINK_API_REQUEST") {
			popup.postMessage(
				{
					type: "TLINK_API_RESPONSE",
					source: "TLINK_API_RESPONSE",
					data: {
						uid: event.data.data.uid,
						method: event.data.data.method,
						response: await handleTlinkApiRequest(
							event.data.data.method,
							event.data.data.payload
						)
					}
				},
				"*"
			)
		}

		if (event.data?.jsonrpc) {
			const resp = await chrome.runtime.sendMessage({
				type: "rpc",
				data: event.data
			})

			sendResponse(event.data, resp)
		}

		function sendResponse(
			messageData: MessageEvent["data"],
			response: any | null
		) {
			const data = messageData

			if (response?.error) {
				data.error = response.error
			} else {
				data.result = response.result
			}

			popup!!.postMessage(
				data,
				"*"
			)
		}
	}

	const width = tsMetadata.fullScreen ? Math.round(screen.width * 0.9) : 550;
	const height = tsMetadata.fullScreen ? Math.round(screen.height * 0.9) : 800;

	popup = popupCenter(dAppUrl, "", width, height);

	window.addEventListener("message", handleMessage);

	if (!popup)
		throw new Error("Failed to open the popup window");
}