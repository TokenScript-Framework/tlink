import {
  getTokenscriptMetadata,
  TsMetadata,
  TsOptions,
} from "./tokenscript/ts-metadata";

export async function metadata(
  chainId: number,
  contract: `0x${string}`,
  tsOptions?: TsOptions,
  tokenId?: string,
  index = 0,
) {
  const result: { tsMetadata?: TsMetadata; tokenMetadata?: any } = {};

  if (tsOptions) {
    result.tsMetadata = await getTokenscriptMetadata(
      chainId,
      contract,
      tsOptions,
      index,
    );
  }

  if (tokenId) {
    result.tokenMetadata = {}; // TODO
  }

  return result;
}
