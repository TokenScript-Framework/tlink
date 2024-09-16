import { ACTIONS_CORS_HEADERS } from '@repo/actions'
import { encodeFunctionData } from 'viem'

// TODO:
const isProd = false
const chainId = isProd ? '8453' : '84532'
const contractAddress = isProd
  ? '0x2F6F12b68165aBb483484927919D0d3fE450462E'
  : '0x40dc7D0B5E11Ee259314C548a238b9c909A4B721'

export const POST = async (req: Request) => {
  try {
    const { account } = await req.json()
    if (!account) {
      return Response.json('Missing account in request body', { status: 400 })
    }

    return Response.json(
      {
        chainId,
        transactionData: {
          from: account,
          to: contractAddress,
          data: encodeFunctionData({
            abi: [
              {
                inputs: [],
                name: 'claim',
                outputs: [],
                stateMutability: 'nonpayable',
                type: 'function',
              },
            ],
            functionName: 'claim',
            args: [],
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
