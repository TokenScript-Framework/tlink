import { ACTIONS_CORS_HEADERS } from '@solana/actions'
import { encodeFunctionData } from 'viem'

export const GET = async (req: Request) => {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS })
}

export const OPTIONS = GET

export const POST = async (req: Request) => {
  // TODO:
  const USER_WALLET = '0x6C30A9544D885F85812e9B92f38EC1dD5f31BB65'
  const TOKEN_ID = 1649017156n

  try {
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

    return Response.json(
      {
        transactionData: {
          from: USER_WALLET,
          to: CAT_GAME,
          data: encodeFunctionData({
            abi: ABI,
            functionName: 'feedCat',
            args: [TOKEN_ID],
          }),
        },
      },
      { headers: ACTIONS_CORS_HEADERS },
    )
  } catch (err) {
    return Response.json('An unknow error occurred', { status: 400 })
  }
}
