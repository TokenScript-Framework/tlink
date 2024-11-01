export async function fetchScriptUri(contract: string, chainId: number) {
  if (!contract) {
    return ""
  }

  return fetchScriptURIFromBackend(contract, chainId).then((v) => {
    const uri =
      v.erc5169 === null || v.erc5169.length === 0 ? v.offchain : v.erc5169
    if (!isERC5169ImplementedWithURLs({ scriptUri: uri })) {
      return fetchDefaultTokenScriptURL(contract, chainId, 0)
    } else {
      return uri?.[0]
    }
  })
}

function isERC5169ImplementedWithURLs(v: {
  scriptUri: string[] | readonly string[] | null | undefined
}) {
  return v.scriptUri && Array.isArray(v.scriptUri) && v.scriptUri.length > 0
}

const BACKEND_BASE = "https://store-backend.smartlayer.network"

async function fetchScriptURIFromBackend(
  contract: string,
  chainId: number
): Promise<{ erc5169: string[] | null; offchain: string[] | null }> {
  const response = await fetch(
    `${BACKEND_BASE}/tokenscript/${contract}/chain/${chainId}/script-uri`
  )
  const data = await response.json()
  return data.scriptURI
}

const fetchDefaultTokenScriptURL = async (
  contract: string,
  chainId: number,
  appIndex: number
): Promise<string | null> => {
  const response = await fetch(
    `${BACKEND_BASE}/tokenscript/${contract}/chain/${chainId}/from-template/${appIndex}`
  )
  const data = await response.json()
  return data.url
}
