import { getERC721Metadata, getTokenscriptMetadata } from '@repo/token-kit';
import { encodeFunctionData } from 'viem';
import type { ActionPostResponse } from '../api/actions-spec';

export const handleGetTokenScriptAction = async (actionUrl: URL) => {
  // example:
  // https://viewer.tokenscript.org/?chain=11155111&contract=0x31fc7840fA14F5e228E31D190b543deBDA13cCDA#card=Play&tokenId=28
  // the tokenId is in the hash
  const params = new URLSearchParams(actionUrl.search);
  const hashParams = new URLSearchParams(actionUrl.hash.slice(1));
  const chainId = params.get('chain');
  const contract = params.get('contract') as `0x${string}`;
  const tokenId = params.get('tokenId') || hashParams.get('tokenId');

  if (!chainId || !contract || !tokenId) {
    throw new Error('invalid tokenscript link');
  }

  const tsMetaData = await getTokenscriptMetadata(Number(chainId), contract, {
    actions: true,
  });
  const tokenMetadata = await getERC721Metadata(
    Number(chainId),
    contract,
    BigInt(tokenId),
  );

  return {
    type: 'action',
    icon:
      tokenMetadata.image ||
      tsMetaData.meta.imageUrl ||
      tsMetaData.meta.iconUrl,
    label: tsMetaData.name,
    title: tsMetaData.name,
    description: tsMetaData.meta.description,
    links: {
      actions: (tsMetaData.actions || []).map((actionName: string) => ({
        label: camelCaseToWords(actionName),
        href: `/api/tokenscript/${chainId}/${contract}/${tokenId}/${actionName}`,
      })),
    },
  };
};

function camelCaseToWords(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

export function handlePostTokenScriptAction(
  actionUrl: string,
  account: string,
): ActionPostResponse {
  // "https://viewer.tokenscript.org/api/tokenscript/137/0xD5cA946AC1c1F24Eb26dae9e1A53ba6a02bd97Fe/1649017156/feedCat"
  const url = new URL(actionUrl);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_api, _tokenscript, chainId, contract, tokenId, actionName] =
    url.pathname.split('/').filter(Boolean);

  return {
    chainId,
    transactionData: {
      from: account,
      to: contract,
      data: encodeFunctionData({
        abi: [
          {
            inputs: [
              {
                internalType: 'uint256',
                name: 'tokenId',
                type: 'uint256',
              },
            ],
            name: actionName,
            outputs: [],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        functionName: actionName,
        args: [BigInt(tokenId)],
      }),
    },
  };
}
