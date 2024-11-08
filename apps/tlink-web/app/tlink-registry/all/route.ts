import { ACTIONS_CORS_HEADERS } from '@repo/actions'

export async function GET() {
  return Response.json(
    {
      actions: [
        { host: 'localhost:3000', state: 'trusted' },
        { host: 'localhost:3001', state: 'trusted' },
        { host: 'tlink.store', state: 'trusted' },
        { host: 'staging-tlink.store', state: 'trusted' },
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
        { host: 'd37i1m1hx1fc5p.cloudfront.net', state: 'trusted' }, // charityconnect.io staging backend
        { host: 'backend.charityconnect.io', state: 'trusted' },
        { host: 'buy-me-a-beer-sigma.vercel.app', state: 'trusted' },
      ],
      interstitials: [
        { host: 'localhost:3000', state: 'trusted' },
        { host: 'localhost:3001', state: 'trusted' },
        { host: 'tlink.store', state: 'trusted' },
        { host: 'staging-tlink.store', state: 'trusted' },
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
        { host: 'd37i1m1hx1fc5p.cloudfront.net', state: 'trusted' }, // charityconnect.io staging backend
        { host: 'backend.charityconnect.io', state: 'trusted' },
        { host: 'buy-me-a-beer-sigma.vercel.app', state: 'trusted' },
      ],
      websites: [
        { host: 'localhost:3000', state: 'trusted' },
        { host: 'localhost:3001', state: 'trusted' },
        { host: 'tlink.store', state: 'trusted' },
        { host: 'staging-tlink.store', state: 'trusted' },
        { host: 'viewer.tokenscript.org', state: 'trusted' },
        { host: 'viewer-staging.tokenscript.org', state: 'trusted' },
        { host: 'www.charityconnect.io', state: 'trusted' },
        { host: 'testnet.charityconnect.io', state: 'trusted' },
        { host: 'd37i1m1hx1fc5p.cloudfront.net', state: 'trusted' }, // charityconnect.io staging backend
        { host: 'backend.charityconnect.io', state: 'trusted' },
        { host: 'buy-me-a-beer-sigma.vercel.app', state: 'trusted' },
      ],
    },
    {
      headers: ACTIONS_CORS_HEADERS,
    },
  )
}

export const OPTIONS = GET
