// @ts-nocheck

import { TokenScript } from "../tokenscript";
import { Contract } from "./Contract";

export class Contracts implements Iterable<Contract | undefined> {
  private contracts?: { [contractName: string]: Contract };

  constructor(private tokenScript: TokenScript) {}

  /**
   * Contracts for the TokenScript
   * @param originsOnly
   */
  public getContractsMap(originsOnly = false) {
    if (!this.contracts) {
      let contractXml =
        this.tokenScript.tokenDef.documentElement.getElementsByTagName(
          "ts:contract",
        );

      this.contracts = {};

      for (let i in contractXml) {
        if (!contractXml.hasOwnProperty(i)) continue;

        const contract = new Contract(contractXml[i]);

        this.contracts[contract.getName()] = contract;
      }
    }

    if (originsOnly) {
      const origins = this.tokenScript.getOrigins();
      const originContracts: { [contractName: string]: Contract } = {};
      for (const name in this.contracts) {
        if (origins[name]) originContracts[name] = this.contracts[name];
      }
      return originContracts;
    }

    return this.contracts;
  }

  /**
   * Returns the contract object with the provided name
   * @param name The contract name as defined by the "name" object in the XML
   */
  getContractByName(name: string) {
    const contracts = this.getContractsMap();

    if (!contracts[name])
      throw new Error(
        "Contract with name " + name + " was not found in the TSML",
      );

    return contracts[name];
  }

  getContractViewData() {
    const contractData = {};

    for (const contract of this) {
      const addresses = {};
      for (const chain in contract!.getAddresses()) {
        addresses[chain] = contract!.getAddresses()[chain].address;
      }

      contractData[contract!.getName()] = {
        addresses,
        abi: contract!.getAbi(),
      };
    }

    return contractData;
  }

  [Symbol.iterator](): Iterator<Contract | undefined> {
    return Object.values<Contract>(this.getContractsMap()).values();
  }
}
