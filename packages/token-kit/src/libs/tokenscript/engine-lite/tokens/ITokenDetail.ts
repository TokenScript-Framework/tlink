/**
 * Represents a specific non-fungible token
 */
export interface ITokenDetail {
  collectionDetails: any
  collectionId: string
  tokenId: string
  name: string
  description: string
  image?: string
  attributes?: NFTAttribute[]
  data?: any
  balance?: string // For ERC1155
}

export interface NFTAttribute {
  trait_type: string
  display_type?: string
  value: string
}

export interface ITokenDetailData {
  collectionId: string // Contract address or attestation collection hash.
  tokenId: string // Duplicated,
  type: any
  // Token specific metadata. For NFTs this is the standard NFT metadata.
  name: string
  image: string
  description: string
  // For attestations, attributes array is prefilled with attribute data,
  // with labels defined in "visibleIdField" elements in attribute definition (James's proposal)
  attributes?: { trait_type: string; value: any }[]
  data?: any
}
