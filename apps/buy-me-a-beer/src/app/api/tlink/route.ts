/* eslint-disable @typescript-eslint/ban-ts-comment */
import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@repo/actions'

export const GET = async () => {
  // const url = new URL(req.url)
  // const account = url.searchParams.get('account')

  const config = {
    userName: 'Tantan Fu',
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
          href: `/api/tlink/USDT?amount=5&userWallet=${config.userWallet}&chainId=137`,
        },
        {
          label: '10 USDT',
          href: `/api/tlink/USDT?amount=10&userWallet=${config.userWallet}&chainId=137`,
        },
        {
          label: '15 USDT',
          href: `/api/tlink/USDT?amount=15&userWallet=${config.userWallet}&chainId=137`,
        },
        {
          label: 'Send Tip',
          href: `/api/tlink/USDT?amount={amount}&userWallet=${config.userWallet}&chainId=137`,
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

export function OPTIONS() {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS })
}
