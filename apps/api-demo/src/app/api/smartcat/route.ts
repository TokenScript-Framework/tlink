import { ACTIONS_CORS_HEADERS, ActionGetResponse } from '@repo/actions'

export const GET = async (req: Request) => {
  const payload: ActionGetResponse = {
    type: 'action',
    icon: 'https://miro.medium.com/v2/resize:fit:1400/format:webp/1*UT8UFZc-pKx7uxNqUaaW3A.png',
    label: 'SmartCat',
    title: 'SmartCat',
    description:
      'Adopt a cat and boost their intelligence through fun care tasks.',
    links: {
      actions: [
        {
          label: 'Feed cat',
          href: '/api/smartcat/feed',
        },
        // {
        //   label: 'Clean cat',
        //   href: '/blinks/swap/So11111111111111111111111111111111111111112/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/0.5',
        // },
        // {
        //   href: '/blinks/swap/So11111111111111111111111111111111111111112/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/{amount}',
        //   label: 'Buy USDT',
        //   parameters: [
        //     {
        //       name: 'amount',
        //       label: 'Enter a custom SOL amount',
        //     },
        //   ],
        // },
      ],
    },
  }
  return Response.json(payload, {
    headers: ACTIONS_CORS_HEADERS,
  })
}

export const OPTIONS = GET
