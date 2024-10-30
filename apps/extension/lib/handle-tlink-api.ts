import { getTwitterHandle } from "@/lib/get-twitter-handle"

export function handleTlinkApiRequest(method: string, payload: any) {
  switch (method) {
    case "getTlinkContext":
      return {
        handle: getTwitterHandle(),
        API_KEY:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9qZWN0IjoibXVsdGktY2hhbm5lbC1yZW5kZXJpbmctdGxpbmsiLCJpYXQiOjE3MjcxNzE1MDl9.9864en0XJbVgzACE_gHrQ00mr6fgctNRXWZ0Nex3DcQ"
      }
  }

  return null
}
