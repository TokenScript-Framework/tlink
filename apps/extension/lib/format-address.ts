export const formatAddress = (
  address: `0x${string}`,
  prefixLength = 6,
  suffixLength = 4
): string => {
  return `${address.slice(0, prefixLength)}...${address.slice(-suffixLength)}`
}
