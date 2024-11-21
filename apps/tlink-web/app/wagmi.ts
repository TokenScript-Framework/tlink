import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import {
  arbitrum,
  base,
  baseSepolia,
  mainnet,
  opBNB,
  optimism,
  polygon,
  sepolia,
} from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'Tlink',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
  chains: [
    mainnet,
    polygon,
    optimism,
    arbitrum,
    base,
    sepolia,
    baseSepolia,
    opBNB,
  ],
  ssr: true, // If your dApp uses server side rendering (SSR)
})
