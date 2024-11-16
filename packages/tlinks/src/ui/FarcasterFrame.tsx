"use client";
import {
  useState,
  useMemo,
  useCallback,
} from "react";
import { useFarcasterIdentity } from "@frames.js/render/identity/farcaster";
import { useFrame } from "@frames.js/render/use-frame";
import {
  fallbackFrameContext,
  type OnTransactionArgs,
  signFrameAction,
} from "@frames.js/render";
import {
  FrameUI,
  type FrameUIComponents,
} from "@frames.js/render/ui";
import { WebStorage } from "@frames.js/render/identity/storage";
import { useNeynarContext } from "@neynar/react";
import { getBlockExplorerUrl, theme, type FarcasterUser, type StylingProps } from "../utils/constants.ts";
import type { ActionAdapter } from "../api/ActionConfig.ts";
import { fetchScriptURI } from "../utils/fetch-ts-data.ts";

interface FarcasterFrameProps {
  chainId: number;
  scriptURI?: string;
  cssClass?: string;
  farcaster: FarcasterUser
  adapter: ActionAdapter
}

const VIEWER_PATTERNS = [
  "viewer",
  "viewer-staging",
  "https://ipfs.io/ipfs",
  "ipfs://ipfs",
  "ipfs://",
];

export async function isViewer(
  actionUrl: URL,
) {
  const params = new URLSearchParams(actionUrl.search);
  const chainId = params.get('chain');
  const contract = params.get('contract') as `0x${string}`;
  
  if (!chainId || !contract) {
    throw new Error('invalid tokenscript link');
  }
  
  try {

    const scriptURI = await fetchScriptURI({
      chainId: Number(chainId),
      contract,
    });

    const isViewerResult = VIEWER_PATTERNS.some((pattern) =>
      pattern === "viewer"
        ? new URL(scriptURI).hostname.startsWith(pattern)
        : scriptURI.toString().toLowerCase().startsWith(pattern)
    ) || scriptURI.toString().toLowerCase().endsWith('.tsml');


    return {
      isTSViewer: isViewerResult,
      scriptURI: scriptURI,
      chain: chainId
    };
  } catch (error) {
    console.error('Error fetching scriptURI:', error);
    return {
      isTSViewer: true,
      scriptURI: '',
      chain: chainId
    };
  }
}

export function FarcasterFrame({
  farcaster,
  chainId,
  scriptURI,
  adapter
}: FarcasterFrameProps) {

  const components: FrameUIComponents<StylingProps> = {};
  const { user } = useNeynarContext();
  const [error, setError] = useState<string | null>(null);
  const [txHash, setTxHash] = useState<string | null>(null);
  const storage = useMemo(() => new WebStorage(), []);

  const signerState = useFarcasterIdentity({
    storage,
    onMissingIdentity: useCallback(() => {
      if (user && typeof user === "object" && user.fid) {
        return signerState.impersonateUser(user.fid);
      }
      return signerState.createSigner();
    }, [user]),
  });

  const frameConfig = useMemo(
    () => ({
      homeframeUrl: scriptURI,
      frameActionProxy:
        "https://frame-render.vercel.app/frames",
      frameGetProxy:
        "https://frame-render.vercel.app/frames",
      frameContext: fallbackFrameContext,
      signerState,
      signFrameAction,
      connectedAddress: farcaster.currentAddress as `0x${string}`,
      async onConnectWallet() {

        if (!farcaster.currentAddress) {
          setError("Please connect the wallet and refresh.")
        }

      },
      async onTransaction(arg: OnTransactionArgs) {
        try {
          setError("");
          if (!farcaster.currentAddress) {
            throw Error("No wallet connected");
          }

          if (!arg.transactionData || typeof arg.transactionData !== "object") {
            throw Error("Wrong transactioin data.");
          }

          const { params } = arg.transactionData;

          const payload = {
            txData: {
              from: farcaster.currentAddress,
              to: params.to as `0x${string}`,
              gas: params.gas ? `0x${Number(params.gas).toString(16)}` : "0x5b8d80", //6000000
              value: params.value ? `0x${Number(params.value).toString(16)}` : "0x0",
              data: params.data as `0x${string}`,
            },
            chainId: `0x${Number(chainId).toString(16)}`
          }

          const resp = await adapter.signTransaction(payload)

          if ('error' in resp && resp.error) {
            throw Error(typeof resp.error === 'string' ? resp.error : resp.error.message);
          }

          if (!('result' in resp)) {
            throw Error('No transaction hash');
          };

          const hash = resp.result as `0x${string}`;
          setTxHash(hash);;
          return hash

        } catch (error: unknown) {
          console.log(error)
          if (error instanceof Error) {
            if (error.message.includes("rejected") || error.message.includes("denied")) {
              setError("User rejected the transaction.");
            } else {
              setError(error.message);
            }
          } else {
            setError(String(error));
          }
          throw error;
        }
      },
    }),
    [scriptURI, signerState, farcaster.currentAddress, chainId, adapter],
  );

  const frameState = useFrame(frameConfig);

  return (
    <>
      <FrameUI frameState={frameState} components={components} theme={theme} />
      {error && (
        <div className="text-red-500 mb-4 p-2 bg-red-100 rounded mt-4 max-w-[600px] break-words">
          Error: {error}
        </div>
      )}
      {txHash && (
        <div className="text-green-500 mb-4 p-2 bg-green-100 rounded mt-4 max-w-[600px] break-words">
          Transaction is submitted. For more details, please access:
          <a
            href={`${getBlockExplorerUrl(chainId)}/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {txHash}
          </a>
        </div>
      )}
    </>
  );
}

