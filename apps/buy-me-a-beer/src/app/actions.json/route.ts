import { ACTIONS_CORS_HEADERS } from '@repo/actions'

export const GET = () => {
  return Response.json(
    {
      rules: [
        {
          pathPattern: '/**',
          apiPath: 'http://localhost:3000/api/tlink/**',
        },
      ],
    },
    {
      headers: ACTIONS_CORS_HEADERS,
    },
  )
}

export const OPTIONS = GET
