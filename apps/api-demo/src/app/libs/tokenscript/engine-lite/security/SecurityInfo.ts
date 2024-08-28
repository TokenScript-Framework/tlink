// @ts-nocheck

import * as IPFSOnlyHash from "ipfs-only-hash";
import { TokenScript } from "../tokenscript";
import { IOriginSecurityInfo, Origin } from "../tokenScript/Origin";
import { DSigValidator } from "./DSigValidator";
import { TrustedKey, TrustedKeyResolver } from "./TrustedKeyResolver";

export enum SecurityStatus {
  VALID = "valid",
  WARNING = "warn",
  INVALID = "invalid",
}

export interface ISecurityInfo {
  authoritivePublicKey?: string;
  signerPublicKey?: string;
  ipfsCid?: string;
  status: SecurityStatus;
  statusText: string;
  trustedKey: TrustedKey | null;
  originStatuses: IOriginSecurityInfo[];
}

/**
 * SecurityInfo is used to determine authenticity and integrity of TokenScript files, and then makes those details
 * available to the user-agent in uniform format.
 * The user-agent can then implement their own functionality for showing validity in the UI.
 */
export class SecurityInfo {
  private securityInfo: Partial<ISecurityInfo> = {};
  private originStatuses: { [name: string]: IOriginSecurityInfo } = {};
  private lock?: Promise<void>;

  // TODO: Implement root key resolution from EAS keychain contract
  //private signerRootKey?: string

  constructor(private tokenScript: TokenScript) {}

  /**
   * Populate the top level security info for the TokenScript.
   * This includes the XML public key and the IPFS CID
   */
  private async loadTokenScriptKeyInfo() {
    const result = await new DSigValidator().getSignerKey(this.tokenScript);

    if (result !== false) {
      this.securityInfo.authoritivePublicKey = result.authoritiveKey;
      this.securityInfo.signerPublicKey = result.signingKey;

      const keyResolver = new TrustedKeyResolver(this.tokenScript);
      this.securityInfo.trustedKey = keyResolver.getTrustedPublicKey(
        this.securityInfo.authoritivePublicKey,
        this.securityInfo.signerPublicKey,
      ) as TrustedKey | null;
    }

    try {
      this.securityInfo.ipfsCid = await IPFSOnlyHash.of(
        this.tokenScript.xmlStr,
        null,
      );
    } catch (e) {
      console.error("Failed to calculate IPFS hash: ", e);
    }
  }

  private async checkAndLoad() {
    if (!this.lock) {
      this.lock = this.loadTokenScriptKeyInfo();
    }

    await this.lock;
  }

  /**
   * Verify the TokenScript file and return validity data
   */
  public async getInfo() {
    await this.checkAndLoad();
    return this.securityInfo;
  }

  /**
   *
   * @param originId
   */
  public async getOriginInfo(originId: string) {
    // TODO: Track valid public keys and contract sources in originInfo and compare to individual NFT or attestation issuer
    await this.checkAndLoad();
    return this.originStatuses[originId];
  }

  public async getContractSecurityInfo(originId: string) {
    await this.checkAndLoad();

    if (this.originStatuses[originId]) return this.originStatuses[originId];

    try {
      if (originId) {
        this.tokenScript.getContracts().getContractByName(originId);
        return new Origin(
          this.tokenScript,
          originId,
          "contract",
        ).getOriginSecurityStatus(this.securityInfo);
      }
    } catch (e) {
      console.warn(originId);
    }

    return <IOriginSecurityInfo>{
      status: SecurityStatus.INVALID,
    };
  }

  public async getAllOriginInfo() {
    await this.checkAndLoad();
    return this.originStatuses;
  }
}
