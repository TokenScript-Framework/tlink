export const handleTokenScript = (actionUrl: URL) => {
  const tokenScriptViewerUrl = 'https://viewer.tokenscript.org/';

  if (!actionUrl.toString().startsWith(tokenScriptViewerUrl)) {
    return actionUrl;
  }

  // example:
  // https://viewer.tokenscript.org/?chain=11155111&contract=0x31fc7840fA14F5e228E31D190b543deBDA13cCDA#card=Play&tokenId=28
  // the tokenId is in the hash
  const params = new URLSearchParams(actionUrl.search);
  const hashParams = new URLSearchParams(actionUrl.hash.slice(1));
  const chain = params.get('chain');
  const contract = params.get('contract');
  const tokenId = params.get('tokenId') || hashParams.get('tokenId');

  if (chain && contract && tokenId) {
    return new URL(`http://localhost:3000/${chain}/${contract}/${tokenId}`);
  }

  return actionUrl;
};
