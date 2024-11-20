import { NeynarAuthButton, SIWN_variant, useNeynarContext } from "@neynar/react";
import { useEffect, useState } from "react";
import { FarcasterFrame } from "./FarcasterFrame.tsx";
import { Buffer } from 'buffer';
import type { FarcasterContainerProps, FarcasterUser } from "../utils/constants.ts";
globalThis.Buffer = Buffer;

export const FarcasterContainer = ({
  chain,
  scriptURI,
  adapter
}: FarcasterContainerProps) => {

  const { user } = useNeynarContext();
  const [farcaster, setFarcaster] = useState<FarcasterUser | null>(null);

  useEffect(() => {
    const setupFarcasterUser = async () => {
      if (user) {
        const address = await adapter.getConnectedAccount();
        setFarcaster({
          fid: user.fid,
          signerUUID: user.signer_uuid,
          username: user.username,
          displayName: user.display_name ?? "",
          verifiedAddresses: {
            ethAddresses: user.verified_addresses.eth_addresses ?? [],
            solAddresses: user.verified_addresses.sol_addresses ?? [],
          },
          currentAddress: address || ''
        });
      }
    };

    setupFarcasterUser();
  }, [adapter, user]);

  return (
    <div className="tlink x-dark">
      <div className="w-full cursor-default overflow-hidden rounded-2xl border border-stroke-primary bg-bg-primary shadow-action p-5">
        <div className="mb-4 neynar-button-container relative flex justify-end">
          <NeynarAuthButton
            variant={SIWN_variant.FARCASTER}
            className="flex items-center p-2 text-white"
          />
        </div>
        {user && farcaster && (
          <FarcasterFrame
            farcaster={farcaster}
            chainId={chain}
            scriptURI={scriptURI}
            adapter={adapter}
          />
        )}
      </div>
    </div>
  );
};
