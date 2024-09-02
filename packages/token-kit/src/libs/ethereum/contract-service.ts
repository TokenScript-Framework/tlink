import axios from "axios";
import {
  createPublicClient,
  defineChain,
  erc721Abi,
  extractChain,
  http,
  PublicClient,
} from "viem";
import * as chains from "viem/chains";
import { erc5169ABI } from "./abi/erc5169";
import {
  getERC5169ScriptURICache,
  setERC5169ScriptURICache,
} from "./erc5169-scriptURI-cache";

const customChains: chains.Chain[] = [
  defineChain({
    id: 185,
    name: "Mint Mainnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: ["https://rpc.mintchain.io"],
      },
    },
    blockExplorers: {
      default: {
        name: "Mint Mainnet blockchain explorer",
        url: "https://explorer.mintchain.io",
      },
    },
    testnet: false,
  }),
  defineChain({
    id: 1687,
    name: "Mint Sepolia Testnet",
    nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
    rpcUrls: {
      default: {
        http: ["https://sepolia-testnet-rpc.mintchain.io"],
      },
    },
    blockExplorers: {
      default: {
        name: "Mint Sepolia Testnet blockchain explorer",
        url: "https://sepolia-testnet-explorer.mintchain.io",
      },
    },
    testnet: true,
  }),
];

export async function getERC721Metadata(
  chainId: number,
  contract: `0x${string}`,
  tokenId: bigint
) {
  try {
    const client = getBatchClient(chainId);

    const tokenURI = await client.readContract({
      address: contract,
      abi: erc721Abi,
      functionName: "tokenURI",
      args: [BigInt(tokenId)],
    });

    return (await axios.get(tokenURI)).data;
  } catch (e) {
    console.log(e);
    return null;
  }
}

export async function getERC5169ScriptURISingle(
  chainId: number,
  contract: `0x${string}`
): Promise<string[] | "not implemented"> {
  let cachedValue = getERC5169ScriptURICache(chainId, contract);
  if (cachedValue !== null) {
    return cachedValue;
  }
  try {
    const onChain = await getERC5169ScriptURI(chainId, contract);
    const result = onChain === null ? "not implemented" : onChain;
    setERC5169ScriptURICache(chainId, contract, result);
    return result;
  } catch {
    setERC5169ScriptURICache(chainId, contract, "not implemented");
    return "not implemented";
  }
}

export async function getERC5169ScriptURIBatched(
  chainId: number,
  contractAddresses: `0x${string}`[]
): Promise<Record<string, string[] | "not implemented">> {
  const cachedScriptURIs: Record<string, string[] | "not implemented"> = {};
  for (const each of contractAddresses) {
    const cachedValue = getERC5169ScriptURICache(chainId, each);
    if (cachedValue !== null) {
      cachedScriptURIs[each] = cachedValue;
    }
  }
  const uniqueContracts = Array.from(new Set(contractAddresses));
  const scriptURIPromises = uniqueContracts.map((each) => {
    return {
      contract: each,
      scriptURI:
        cachedScriptURIs[each] !== undefined
          ? cachedScriptURIs[each]
          : getERC5169ScriptURI(chainId, each),
    };
  });
  let scriptURIs: Record<string, string[] | "not implemented"> = {};
  for (const each of scriptURIPromises) {
    if (each.scriptURI instanceof Promise) {
      try {
        const result = await each.scriptURI;
        scriptURIs[each.contract] =
          result === null ? "not implemented" : result;
      } catch {
        scriptURIs[each.contract] = "not implemented";
      }
    } else {
      scriptURIs[each.contract] = each.scriptURI;
    }
  }
  for (const [eachContract, eachScriptURI] of Object.entries(scriptURIs)) {
    if (cachedScriptURIs[eachContract] === undefined) {
      setERC5169ScriptURICache(chainId, eachContract, eachScriptURI);
    }
  }
  return scriptURIs;
}

async function getERC5169ScriptURI(
  chainId: number,
  contractAddress: `0x${string}`
) {
  try {
    const client = getBatchClient(chainId);

    return client
      .readContract({
        address: contractAddress,
        abi: erc5169ABI,
        functionName: "scriptURI",
      })
      .catch((e) => {
        console.log(e);
        return "not implemented";
      }) as Promise<string[] | null | "not implemented">;
  } catch {
    return null;
  }
}

const clientCache: Record<number, PublicClient> = {};
function getBatchClient(chainId: any) {
  if (!clientCache[chainId]) {
    clientCache[chainId] = createPublicClient({
      chain: extractChain({
        chains: [...Object.values(chains), ...customChains],
        id: chainId,
      }),
      transport: http(),
      batch: {
        // Apply the same config as ethers.js batch provider
        multicall: {
          batchSize: 100,
          wait: 10,
        },
      },
    }) as any;
  }

  return clientCache[chainId];
}
