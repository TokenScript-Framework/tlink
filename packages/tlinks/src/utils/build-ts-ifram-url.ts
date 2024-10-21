export const buildTsIframeUrl = ({
  chainId,
  contract,
  card,
  tokenId,
  scriptId,
}: {
  chainId: string | null;
  contract: string | null;
  card?: string | null;
  tokenId?: string | null;
  scriptId?: string | null;
}) => {
  const dAppUrlParams = new URLSearchParams({
    viewType: 'tlink-card',
    chain: chainId || '',
    contract: contract || '',
  });

  if (card) dAppUrlParams.append('card', card);
  if (tokenId) dAppUrlParams.append('tokenId', tokenId);
  if (scriptId) dAppUrlParams.append('scriptId', scriptId);

  return `https://viewer-staging.tokenscript.org/?${dAppUrlParams.toString()}`;
};