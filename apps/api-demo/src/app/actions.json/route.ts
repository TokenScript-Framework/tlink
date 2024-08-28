import { ACTIONS_CORS_HEADERS } from '@repo/actions'

export const GET = (req: Request) => {
  return Response.json(
    {
      rules: [
        {
          pathPattern: '/smartcat',
          apiPath: 'http://localhost:3000/api/smartcat',
        },
      ],
    },
    {
      headers: ACTIONS_CORS_HEADERS,
    },
  )
}

export const OPTIONS = GET
