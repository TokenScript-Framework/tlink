import {TS_VIEWER_URL} from "./constants.ts";

export const buildTsIframeUrl = ({
  chainId,
  contract,
  card,
  tokenId,
  scriptId,
  originId,
  hash,
}: {
  chainId: string | null;
  contract: string | null;
  card?: string | null;
  tokenId?: string | null;
  scriptId?: string | null;
  originId?: string | null;
  hash?: string | null; // must start with #
}) => {
  const dAppUrlParams = new URLSearchParams({
    viewType: 'tlink-card',
    chain: chainId || '',
    contract: contract || '',
  });

  if (card) dAppUrlParams.append('card', card);
  if (originId) dAppUrlParams.append('originId', originId);
  if (tokenId) dAppUrlParams.append('tokenId', tokenId);
  if (scriptId) dAppUrlParams.append('scriptId', scriptId);

  return `${TS_VIEWER_URL}?${dAppUrlParams.toString()}${
    (hash || '').length > 1 ? hash : ''
  }`;
};
