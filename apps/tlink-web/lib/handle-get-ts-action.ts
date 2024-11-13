import { fetchTsData } from '@repo/tlinks'

export const handleGetTokenScriptAction = async (actionUrl: URL) => {
  // example:
  // https://viewer.tokenscript.org/?chain=11155111&contract=0x31fc7840fA14F5e228E31D190b543deBDA13cCDA#card=Play&tokenId=28
  // the tokenId is in the hash
  const params = new URLSearchParams(actionUrl.search)
  const hashParams = new URLSearchParams(actionUrl.hash.slice(1))
  const chainId = params.get('chain')
  const contract = params.get('contract') as `0x${string}`
  const tokenId =
    params.get('tokenId') || hashParams.get('tokenId') || undefined
  const scriptId =
    params.get('scriptId') || hashParams.get('scriptId') || undefined // 7738_2
  const scriptIndex = scriptId ? scriptId.split('_')[1] : undefined // get the index for example 2

  if (!chainId || !contract) {
    throw new Error('invalid tokenscript link')
  }

  return fetchTsData({
    chainId: Number(chainId),
    contract,
    tokenId,
    entry: scriptIndex || undefined,
    scriptId,
    hash: actionUrl.hash,
  })
}
