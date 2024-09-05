import { SignedOffchainAttestation } from "@ethereum-attestation-service/eas-sdk";
import { ScriptSourceType } from "../Engine";

export interface IAttestationData {
  collectionId: string;
  tokenId: string;
  type: "eas";
  token: string;
  decodedToken: SignedOffchainAttestation;
  decodedData: { [name: string]: any };
  meta: {
    [name: string]: any;
  };
  authoritativeTokenScript: {
    tsId: string; // URL or resolver ID
    source: ScriptSourceType;
  };
  dt: number;
}

export interface IAttestationStorageAdapter {
  saveAttestation(attestationData: IAttestationData): Promise<void>;
  getAttestations(collectionIds: string[]): Promise<IAttestationData[]>;
  removeAttestation(collectionId: string, id: string): Promise<void>;
}
