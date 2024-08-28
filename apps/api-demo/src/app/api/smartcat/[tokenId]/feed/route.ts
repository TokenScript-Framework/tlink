import { ACTIONS_CORS_HEADERS } from '@repo/actions'
import { encodeFunctionData } from 'viem'

export const GET = async (req: Request) => {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS })
}

export const OPTIONS = GET

const ABI = [
  {
    inputs: [{ internalType: 'uint256', name: 'tokenId', type: 'uint256' }],
    name: 'feedCat',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const CAT_GAME = '0x7573933eB12Fa15D5557b74fDafF845B3BaF0ba2'

export const POST = async (
  req: Request,
  { params }: { params: { tokenId: string } },
) => {
  try {
    const { account } = await req.json()
    if (!account) {
      return Response.json('Missing account in request body', { status: 400 })
    }

    return Response.json(
      {
        transactionData: {
          from: account,
          to: CAT_GAME,
          data: encodeFunctionData({
            abi: ABI,
            functionName: 'feedCat',
            args: [BigInt(params.tokenId)],
          }),
        },
      },
      { headers: ACTIONS_CORS_HEADERS },
    )
  } catch (err) {
    return Response.json('An unknown error occurred', { status: 400 })
  }
}
