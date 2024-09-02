import { CacheService } from "../../utils/cache";

//We need the "not implemented" state to avoid too many cache misses because contracts don't implement ERC-5169
const eRC5169ScriptURICache = new CacheService<string[] | "not implemented">();

export function getERC5169ScriptURICache(chainId: number, contract: string) {
  return eRC5169ScriptURICache.get(cacheKey(chainId, contract));
}

export function setERC5169ScriptURICache(
  chainId: number,
  contract: string,
  scriptURI: string[] | "not implemented",
) {
  //with an additional randomness of ~0 to 60s to avoid cache stampede
  const ttl: number = (5 * 60 + Math.floor(Math.random() * 60)) * 1000; //5 = 5 minutes
  eRC5169ScriptURICache.set(cacheKey(chainId, contract), scriptURI, ttl);
}

export function invalidateERC5169ScriptURICache(
  chainId: number,
  contract: string,
) {
  eRC5169ScriptURICache.invalidate(cacheKey(chainId, contract));
}

function cacheKey(chainId: number, contract: string) {
  return `scriptURI-${chainId}-${contract.toLowerCase()}`;
}
