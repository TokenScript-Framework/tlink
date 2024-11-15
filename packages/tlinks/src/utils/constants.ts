import type { FrameUITheme } from '@frames.js/render/ui';
import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import {
  arbitrum,
  arbitrumGoerli,
  base,
  baseSepolia,
  bsc,
  bscTestnet,
  goerli,
  mainnet,
  optimism,
  optimismGoerli,
  polygon,
  polygonMumbai,
  sepolia,
} from 'viem/chains';

export const noop = () => {};

export type StylingProps = {
  className?: string;
  style?: React.CSSProperties;
};

export const wagmiProviderConfig: ReturnType<typeof getDefaultConfig> =
  getDefaultConfig({
    appName: 'Tlink',
    projectId: 'da8933d8-14f9-4c77-a5bc-dec0a855f034',
    chains: [mainnet, polygon, optimism, arbitrum, base, sepolia, baseSepolia],
    ssr: true,
  });

export const theme: FrameUITheme<StylingProps> = {
  Root: {
    className:
      'flex flex-col max-w-[600px] rounded-lg ovrflow-hidden relative farcaster-container',
  },
  LoadingScreen: {
    className: 'absolute top-0 left-0 right-0 bottom-0 bg-gray-300 z-10',
  },
  ImageContainer: {
    className: 'relative w-full rounded overflow-hidden mb-5',
    style: {
      aspectRatio: 'var(--frame-image-aspect-ratio)',
    },
  },
  ButtonsContainer: {
    className: 'flex justify-evenly space-x-2 px-2 pb-2',
  },
  Button: {
    className:
      'flex w-full items-center justify-center text-nowrap rounded-button px-4 py-3 font-semibold transition-colors motion-reduce:transition-none',
  },
};
const SUPPORTED_CHAINS = [
  mainnet,
  goerli,
  sepolia,
  polygon,
  polygonMumbai,
  bsc,
  bscTestnet,
  arbitrum,
  arbitrumGoerli,
  optimism,
  optimismGoerli,
  base,
  baseSepolia,
] as const;

function getChainById(chainId: number) {
  return SUPPORTED_CHAINS.find((c) => c.id === chainId);
}

export function getBlockExplorerUrl(chainId: number): string {
  const chain = getChainById(chainId);
  return chain?.blockExplorers?.default?.url || 'https://etherscan.io';
}

export function getRPCURL(chainId: number): string {
  const chain = getChainById(chainId);
  return (
    (chain?.rpcUrls.default.http[0] as string) || 'https://cloudflare-eth.com'
  );
}

export interface FarcasterUser {
  fid: number;
  signerUUID: string;
  username: string;
  displayName: string;
  verifiedAddresses: {
    ethAddresses: string[];
    solAddresses: string[];
  };
  currentAddress: string;
}

export type FarcasterContainerProps = {
  chain: number;
  scriptURI: string;
};
