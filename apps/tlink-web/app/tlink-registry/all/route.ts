import { ACTIONS_CORS_HEADERS } from '@repo/actions'

export async function GET() {
  return Response.json(
    {
      actions: [
        { host: 'localhost:3000', state: 'trusted' },
        { host: 'localhost:3001', state: 'trusted' },
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
      ],
      interstitials: [
        { host: 'localhost:3000', state: 'trusted' },
        { host: 'localhost:3001', state: 'trusted' },
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
      ],
      websites: [
        { host: 'localhost:3000', state: 'trusted' },
        { host: 'localhost:3001', state: 'trusted' },
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
      ],
    },
    {
      headers: ACTIONS_CORS_HEADERS,
    },
  )
}

export const OPTIONS = GET
