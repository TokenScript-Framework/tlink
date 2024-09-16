import { ACTIONS_CORS_HEADERS } from '@repo/actions'

export async function GET() {
  return Response.json(
    {
      actions: [
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
      ],
      interstitials: [
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
      ],
      websites: [
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
