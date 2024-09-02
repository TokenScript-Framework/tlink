import { getTokenscriptMetadata, TsMetadata } from "../libs/tokenscript/ts-metadata";

export const getMetadata = async (chain: number, address: `0x${string}`) => {
  console.log("###", chain, address);
  const tsMetadata: TsMetadata = await getTokenscriptMetadata(chain, address);
  return tsMetadata;
};
