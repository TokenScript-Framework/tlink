/**
 * This is the top level token interface. In ethereum it represents a contract/collection.
 * NFTs have child token details whilst FTs only have a balance
 */
import {ITokenDetail} from "./ITokenDetail";

export type TokenType = "erc20" | "erc721" | "erc1155" | "eas";

export type BlockChain = "eth" | "offchain";

export interface ITokenCollection {
	originId: string,
	blockChain: BlockChain;
	chainId: number;
	tokenType: TokenType;
	contractAddress?: string;
	name?: string;
	description?: string;
	symbol?: string;
	decimals?: number;
	balance?: number|bigint;
	image?: string;
	tokenDetails?: ITokenDetail[];
	data?: any;
}
