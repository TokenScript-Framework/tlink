import { useEffect, useState } from "react";
import { getTokenscriptMetadata, TsOptions, TsMetadata } from "../libs";

export const useTsMetadata = (v: {
  chainId: number;
  contract: `0x${string}`;
  options?: TsOptions;
}) => {
  const { chainId, contract, options } = v;

  const [tsMetadata, setTsMetadata] = useState<TsMetadata | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let isMounted = true;

    (async function check() {
      if (isMounted) {
        setTsMetadata(await getTokenscriptMetadata(chainId, contract, options));
        setIsChecking(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [chainId, contract]);

  return { tsMetadata, isChecking };
};
