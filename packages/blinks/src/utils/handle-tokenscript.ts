export const handleTokenScript = (actionUrl: URL) => {
  const tokenScriptViewerUrl = 'https://viewer.tokenscript.org/';

  if (!actionUrl.toString().startsWith(tokenScriptViewerUrl)) {
    return actionUrl;
  }

  const params = new URLSearchParams(actionUrl.search);
  const chain = params.get('chain');
  const contract = params.get('contract');
  const tokenId = params.get('tokenId');

  if (chain && contract && tokenId) {
    return new URL(`http://localhost:3000/${chain}/${contract}/${tokenId}`);
  }

  return actionUrl;
};
