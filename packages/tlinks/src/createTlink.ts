// import { getERC721Metadata } from '@/app/libs/ethereum'
// import { getMetadata } from '@/app/service/externalApi'
import { ACTIONS_CORS_HEADERS } from '@repo/actions';
import { encodeFunctionData } from 'viem';
import { fetchTlinkData } from './utils/fetch-ts-data';

type ChainId = string;
type Contract = `0x${string}`;
type TokenId = string;
type ActionName = string;
type TLinkGetParams = [ChainId, Contract, TokenId];
type TLinkPostParams = [ChainId, Contract, TokenId, ActionName];

export const createTLink = () => {
  return { GET: buildGet(), POST: buildPost(), OPTIONS };
};

function buildGet() {
  return async (
    _req: Request,
    { params }: { params: { tlink: TLinkGetParams } },
  ) => {
    const [chainId, contract, tokenId] = params.tlink;

    const payload = await fetchTlinkData({
      chainId: Number(chainId),
      contract,
      tokenId,
      entry: undefined,
    });

    return Response.json(payload, { headers: ACTIONS_CORS_HEADERS });
  };
}

function buildPost() {
  return async (
    req: Request,
    { params }: { params: { tlink: TLinkPostParams } },
  ) => {
    const [chainId, contract, tokenId, actionName] = params.tlink;
    try {
      const { account } = await req.json();
      if (!account) {
        return Response.json('Missing account in request body', {
          status: 400,
        });
      }

      return Response.json(
        {
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
        },
        { headers: ACTIONS_CORS_HEADERS },
      );
    } catch (err) {
      return Response.json('An unknown error occurred', { status: 400 });
    }
  };
}

function OPTIONS() {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS });
}
