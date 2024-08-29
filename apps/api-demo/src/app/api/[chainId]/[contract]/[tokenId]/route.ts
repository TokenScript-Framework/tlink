import { getERC721Metadata } from '@/app/libs/ethereum'
import { getMetadata } from '@/app/service/externalApi'
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from '@repo/actions'

export const GET = async (
  req: Request,
  {
    params,
  }: { params: { chainId: string; contract: string; tokenId: string } },
) => {
  const tsMetaData = await getMetadata(
    Number(params.chainId),
    params.contract as `0x${string}`,
  )
  const tokenMetadata = await getERC721Metadata(
    Number(params.chainId),
    params.contract as `0x${string}`,
    BigInt(params.tokenId),
  )

  const payload: ActionGetResponse = {
    type: 'action',
    icon: tokenMetadata.image || tsMetaData.meta.imageUrl,
    label: tsMetaData.name,
    title: tsMetaData.name,
    description: tsMetaData.meta.description,
    links: {
      actions:
        tsMetaData.actions
          ?.map((actionName) => ({
            label: camelCaseToWords(actionName),
            href: `/api/${params.chainId}/${params.contract}/${params.tokenId}/${actionName}`,
          }))
          .concat([
            {
              label: 'Feed Cat',
              href: `/api/${params.chainId}/${params.contract}/${params.tokenId}/feedCat`,
            },
          ]) || [],
    },
  }

  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  })
}

export const OPTIONS = GET

function camelCaseToWords(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase()
    })
    .trim()
}
