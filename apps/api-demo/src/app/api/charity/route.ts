import { ActionGetResponse, ACTIONS_CORS_HEADERS } from '@repo/actions'
import { createPublicClient, erc721Abi, http } from 'viem'
import { base, baseSepolia } from 'viem/chains'

const isProd = false
const chainId = isProd ? '8453' : '84532'
const contractAddress = isProd
  ? '0x2F6F12b68165aBb483484927919D0d3fE450462E'
  : '0x40dc7D0B5E11Ee259314C548a238b9c909A4B721'

export const GET = async (req: Request) => {
  const url = new URL(req.url)
  const account = url.searchParams.get('account')

  // Create a public client
  const client = createPublicClient({
    chain: isProd ? base : baseSepolia,
    transport: http(),
  })

  let hasMinted = false
  if (account) {
    try {
      const balance = await client.readContract({
        address: contractAddress,
        abi: erc721Abi,
        functionName: 'balanceOf',
        args: [account as `0x${string}`],
      })
      hasMinted = BigInt(balance) > 0n
    } catch (error) {
      console.error('Error checking mint status:', error)
    }
  }

  const payload: ActionGetResponse = {
    type: 'action',
    icon: 'https://www.charityconnect.io/assets/images/charity-connect-og.png',
    label: hasMinted ? 'Already Claimed' : 'Claim',
    title: hasMinted ? 'Already Claimed' : 'Claim',
    description: hasMinted
      ? 'You have already claimed your free pass.'
      : 'Claim your free pass',
    links: {
      actions: hasMinted
        ? []
        : [
            {
              label: 'Claim',
              href: `/api/charity/claim`,
            },
          ],
    },
  }

  return Response.json(payload, { headers: ACTIONS_CORS_HEADERS })
}

export function OPTIONS() {
  return Response.json({}, { headers: ACTIONS_CORS_HEADERS })
}
