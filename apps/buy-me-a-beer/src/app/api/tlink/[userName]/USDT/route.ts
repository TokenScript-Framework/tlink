import { ACTIONS_CORS_HEADERS } from '@repo/actions'
import { type NextRequest } from 'next/server'
import { encodeFunctionData, erc20Abi, parseUnits } from 'viem'

const chainIdToContractAddress = {
  // eth
  '1': '0xdac17f958d2ee523a2206206994597c13d831ec7',
  // polygon
  '137': '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
}

export const POST = async (req: NextRequest) => {
  const searchParams = req.nextUrl.searchParams
  const amount = searchParams.get('amount')
  const userWallet = searchParams.get('userWallet')
  const chainId = searchParams.get('chainId')

  console.log('amount', amount)
  console.log('userWallet', userWallet)

  try {
    const { account } = await req.json()
    if (!account || !chainId || !userWallet || !amount) {
      return Response.json('Bad Request', { status: 400 })
    }

    return Response.json(
      {
        chainId,
        transactionData: {
          from: account,
          to: chainIdToContractAddress[
            chainId as keyof typeof chainIdToContractAddress
          ],
          data: encodeFunctionData({
            abi: erc20Abi,
            functionName: 'transfer',
            args: [userWallet as `0x${string}`, parseUnits(amount, 6)],
          }),
        },
      },
      { headers: ACTIONS_CORS_HEADERS },
    )
  } catch (err) {
    return Response.json('An unknown error occurred', { status: 400 })
  }
}

export function OPTIONS() {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS })
}
