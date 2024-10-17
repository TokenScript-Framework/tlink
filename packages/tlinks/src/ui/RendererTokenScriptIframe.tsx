import { buildTsIframeUrl } from '../utils/build-ts-ifram-url';
import { isTokenScriptViewerUrl } from '../utils/is-tokenscript-viewer-url';
import { TokenScriptIframe } from './TokenScriptIframe';

export const RendererTokenScriptIframe = (props: { websiteUrl: string }) => {
  if (
    props.websiteUrl &&
    isTokenScriptViewerUrl(props.websiteUrl) &&
    props.websiteUrl.includes('card=')
  ) {
    const url = new URL(props.websiteUrl);

    const params = new URLSearchParams(url.search);
    const hashParams = new URLSearchParams(url.hash.slice(1));
    const chainId = params.get('chain');
    const contract = params.get('contract') as `0x${string}`;
    const tokenId = params.get('tokenId') || hashParams.get('tokenId');
    const card = params.get('card') || hashParams.get('card');
    const scriptId = params.get('scriptId') || hashParams.get('scriptId');

    const dAppUrl = buildTsIframeUrl({
      chainId,
      contract,
      card,
      tokenId,
      scriptId,
    });

    return (
      <div style={{ height: '700px' }}>
        <TokenScriptIframe dAppUrl={dAppUrl} />
      </div>
    );
  }

  return null;
};
