import { isProd } from '@/lib/utils'
import { ACTIONS_CORS_HEADERS } from '@repo/actions'

export const GET = () => {
  return Response.json(
    {
      rules: [
        {
          pathPattern: '/**',
          apiPath: isProd
            ? 'https://buy-me-a-beer-sigma.vercel.app/api/tlink/**'
            : 'http://localhost:3000/api/tlink/**',
        },
      ],
    },
    {
      headers: ACTIONS_CORS_HEADERS,
    },
  )
}

export const OPTIONS = GET
