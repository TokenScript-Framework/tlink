// @ts-nocheck

import { ethers } from "ethers";
import { TokenScript } from "../tokenscript";

export interface TrustedKey {
  issuerName: string;
  valueType: "ec" | "ethAddress";
  value: string;
}

const trustedKeys = [
  {
    issuerName: "Smart Token Labs",
    valueType: "ethAddress",
    value: "0x1c18e4eF0C9740e258835Dbb26E6C5fB4684C7a0",
  },
  {
    issuerName: "Smart Token Labs",
    valueType: "ethAddress",
    value: "0xf68b9DbfC6C3EE3323Eb9A3D4Ed8eb9d2Cb45A30",
  },
  {
    issuerName: "Smart Token Labs",
    valueType: "ethAddress",
    value: "0x8646DF47d7b16Bf9c13Da881a2D8CDacDa8f5490",
  },
];

/**
 * The contract key resolver is used to resolve the owner or deployer of a smart contract
 */
export class TrustedKeyResolver {
  constructor(private tokenScript: TokenScript) {}

  public getTrustedPublicKey(authPubKey: string, signerPubKey: string) {
    const authEthAddress = ethers.computeAddress(authPubKey);
    const signerEthAddress = ethers.computeAddress(signerPubKey);

    for (const trustedKey of trustedKeys) {
      if (trustedKey.valueType === "ethAddress") {
        if (
          authEthAddress.toLowerCase() === trustedKey.value.toLowerCase() ||
          signerEthAddress.toLowerCase() === trustedKey.value.toLowerCase()
        )
          return trustedKey;
      } else {
        if (
          authPubKey.toLowerCase() === trustedKey.value.toLowerCase() ||
          signerPubKey.toLowerCase() === trustedKey.value.toLowerCase()
        )
          return trustedKey;
      }
    }

    return null;
  }
}
