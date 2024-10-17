import { encodeFunctionData } from 'viem';
import type { ActionPostResponse } from '../api/actions-spec';
import { fetchTlinkData } from './fetch-ts-data';

export const handleGetTokenScriptAction = async (actionUrl: URL) => {
  // example:
  // https://viewer.tokenscript.org/?chain=11155111&contract=0x31fc7840fA14F5e228E31D190b543deBDA13cCDA#card=Play&tokenId=28
  // the tokenId is in the hash
  const params = new URLSearchParams(actionUrl.search);
  const hashParams = new URLSearchParams(actionUrl.hash.slice(1));
  const chainId = params.get('chain');
  const contract = params.get('contract') as `0x${string}`;
  const tokenId =
    params.get('tokenId') || hashParams.get('tokenId') || undefined;
  const scriptId = params.get('scriptId') || hashParams.get('scriptId'); // 7738_2
  const scriptIndex = scriptId ? scriptId.split('_')[1] : undefined; // get the index for example 2

  if (!chainId || !contract) {
    throw new Error('invalid tokenscript link');
  }

  return fetchTlinkData({
    chainId: Number(chainId),
    contract,
    tokenId,
    entry: scriptIndex || undefined,
  });
};

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
    metadata: {
      contract,
      tokenId,
      actionName,
    },
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
