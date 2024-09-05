// import { getERC721Metadata } from '@/app/libs/ethereum'
// import { getMetadata } from '@/app/service/externalApi'
import { ACTIONS_CORS_HEADERS } from '@repo/actions';
import { getERC721Metadata, getTokenscriptMetadata } from '@repo/token-kit';
import { encodeFunctionData } from 'viem';

type ChainId = string;
type Contract = `0x${string}`;
type TokenId = string;
type ActionName = string;
type TLinkGetParams = [ChainId, Contract, TokenId];
type TLinkPostParams = [ChainId, Contract, TokenId, ActionName];

export const createTLink = () => {
  return { GET: buildGet(), POST: buildPost(), OPTIONS };
};

function camelCaseToWords(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase();
    })
    .trim();
}

function buildGet() {
  return async (
    _req: Request,
    { params }: { params: { tlink: TLinkGetParams } },
  ) => {
    const [chainId, contract, tokenId] = params.tlink;
    const tsMetaData = await getTokenscriptMetadata(Number(chainId), contract, {
      actions: true,
    });
    const tokenMetadata = await getERC721Metadata(
      Number(chainId),
      contract,
      BigInt(tokenId),
    );

    const payload: any = {
      type: 'action',
      icon: tokenMetadata.image || tsMetaData.meta.imageUrl,
      label: tsMetaData.name,
      title: tsMetaData.name,
      description: tsMetaData.meta.description,
      links: {
        actions: (tsMetaData.actions || []).map((actionName) => ({
          label: camelCaseToWords(actionName),
          href: `/api/tokenscript/${chainId}/${contract}/${tokenId}/${actionName}`,
        })),
      },
    };

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
