import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@repo/actions'
import { notFound } from 'next/navigation'
import { type NextRequest } from 'next/server'
import { encodeFunctionData, erc20Abi, parseUnits } from 'viem'

export const GET = async (
  request: Request,
  { params }: { params: { userName: string } },
) => {
  if (params.userName !== 'TantanFu') {
    notFound()
  }

  const config = {
    userName: params.userName,
    userWallet: '0x6C30A9544D885F85812e9B92f38EC1dD5f31BB65',
  }

  const payload: ActionGetResponse = {
    type: 'action',
    icon: 'https://avatars.githubusercontent.com/u/6268441?v=4',
    label: `Buy ${config.userName} a Beer`,
    title: `Buy ${config.userName} a Beer`,
    description: '',
    links: {
      actions: [
        {
          label: '5 USDT',
          href: `/api/tlink/${params.userName}/?amount=5&userWallet=${config.userWallet}&chainId=137`,
        },
        {
          label: '10 USDT',
          href: `/api/tlink/${params.userName}/?amount=10&userWallet=${config.userWallet}&chainId=137`,
        },
        {
          label: '15 USDT',
          href: `/api/tlink/${params.userName}/?amount=15&userWallet=${config.userWallet}&chainId=137`,
        },
        {
          label: 'Send Tip',
          href: `/api/tlink/${params.userName}/?amount={amount}&userWallet=${config.userWallet}&chainId=137`,
          parameters: [
            {
              name: 'amount',
              label: 'Custom USDT amount',
            },
          ],
        },
      ],
    },
  }

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
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
          to: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
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
  return new Response(null, {
    headers: ACTIONS_CORS_HEADERS,
  })
}
