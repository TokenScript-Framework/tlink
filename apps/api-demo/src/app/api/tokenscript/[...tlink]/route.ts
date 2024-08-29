// import { handlers } from '@/auth'

// export const { GET, POST } = handlers
import { getERC721Metadata } from '@/app/libs/ethereum'
import { getMetadata } from '@/app/service/externalApi'
import { ACTIONS_CORS_HEADERS, ActionGetResponse } from '@repo/actions'

type ChainId = string
type Contract = `0x${string}`
type TokenId = string
type ActionName = string
type Tlink =
  | [ChainId, Contract, TokenId]
  | [ChainId, Contract, TokenId, ActionName]

export const GET = async (
  req: Request,
  { params }: { params: { tlink: Tlink } },
) => {
  const [chainId, contract, tokenId, actionName] = params.tlink
  const tsMetaData = await getMetadata(Number(chainId), contract)
  const tokenMetadata = await getERC721Metadata(
    Number(chainId),
    contract,
    BigInt(tokenId),
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
            href: `/api/${chainId}/${contract}/${tokenId}/${actionName}`,
          }))
          .concat([
            {
              label: 'Feed Cat',
              href: `/api/${chainId}/${contract}/${tokenId}/feedCat`,
            },
          ]) || [],
    },
  }

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

export const OPTIONS = async (req: Request) => {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS })
}

function camelCaseToWords(str: string) {
  return str
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, function (str) {
      return str.toUpperCase()
    })
    .trim()
}
