import {ITokenDetailData} from "./ITokenDetail";

/**
 * The data that is injected into a tokenscript card, and can be used as transaction arguments.
 * These intrinsic values take precedence over attributes defined with the same name
 */
// TODO: Confirm all questions in comments
export interface ITokenContextData {
	name: string; // Collection level name or title
	description?: string; // Collection level description
	label: string; // Should this be the label of the TokenScript?
	symbol?: string;
	_count?: string; // Balance of the current token (or total tokens if it's an NFT or attestation)
	balance?: string;
	decimals?: number;
	contractAddress?: string; // Only set for blockchain tokens
	chainId: number; // The chain of the token or 0 if it's an attestation
	tokenId?: number|string; // In the case of attestations, this is the ID generated using idFields in the attestation definition
	ownerAddress: string; // The owner of the blockchain token OR the recipient field in an attestation
	image_preview_url?: string; // Collection or token level image?
	// TODO: look at namespacing tokenscript XML attributes & user-input values to avoid name collision
	/*attributes: {
		[attributeName: string]: any // A collection of TokenScript XML attributes & user-input values
	}*/
	[attributeName: string]: any
	// NFT Related data: NOT specified for fungible tokens
	tokenInfo?: ITokenDetailData
	// Is it a good idea putting these here? If we implement dot notation for transaction arguments then it's a bit redundant
	attestation?: string;
	attestationSig?: string;
}
