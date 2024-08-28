// @ts-nocheck

import { ITokenIdContext, TokenScript } from "../../tokenscript";
import { Attribute } from "../Attribute";
import { Attributes } from "../Attributes";

export interface IArgument {
  type: string;
  content?: string;
  ref?: string;
  localRef?: string;
}

/**
 * AbstractDependency branch is used to represent a special value or attribute that another attribute or transaction depends on.
 * It is used to implement dependency tree calculation & attribute invalidation across all attribute sources.
 * Each attribute source can extend AbstractDependencyBranch to use dynamic values in their own resolution.
 */
export abstract class AbstractDependencyBranch implements IArgument {
  type: string;
  content?: string;
  ref?: string;
  localRef?: string;

  protected constructor(
    protected tokenScript: TokenScript,
    protected localAttrContext?: Attributes,
  ) {}

  public async getValue(tokenContext?: ITokenIdContext) {
    switch (this.ref) {
      // TODO: This can be removed, these are provided via context data
      case "tokenId":
        if (!tokenContext)
          throw new Error(
            "tokenId reference cannot be resolved as no token context is set.",
          );

        if (tokenContext.selectedTokenId) {
          const rawValue = tokenContext.selectedTokenId;
          return BigInt(rawValue);
        } else {
          throw new Error(
            "tokenId reference is not accessible under the context of a fungible token",
          );
        }

      case "ownerAddress":
        const walletProvider = await this.tokenScript
          .getEngine()
          .getWalletAdapter();
        return await walletProvider.getCurrentWalletAddress();

      case "contractAddress":
        if (!tokenContext)
          throw new Error(
            "contractAddress reference cannot be resolved as no token context is set. Use a fully qualified reference instead.",
          );
        return this.tokenScript
          .getContracts()
          .getContractByName(tokenContext.originId)
          .getAddressByChain(tokenContext.chainId).address;

      default:
        // First we check if the value is a contract address reference
        if (this.ref) {
          if (this.ref.indexOf("contractAddress_") === 0) {
            const parts = this.ref.split("_");
            const contract = this.tokenScript
              .getContracts()
              .getContractByName(parts[1]);
            return contract.getAddressByChain(Number(parts[2]), !parts[2])
              .address;
          }

          // Then check if values is provided in TokenContextData
          const contextData =
            await this.tokenScript.getTokenContextData(tokenContext);

          if (contextData?.[this.ref]) return contextData[this.ref];
        }

        return await this.resolveValue(tokenContext);
    }
  }

  public invalidateDependencies(dependentOn: string[]) {
    // Static attribute never become invalid
    if (!this.isStaticAttribute()) return false;

    if (this.isSpecialRef()) {
      return dependentOn.indexOf(this.ref) > -1;
    }

    try {
      // TODO: Rework this to avoid exception
      const attribute = this.getBackingAttribute();
      return attribute.invalidate(dependentOn);
    } catch (e) {
      return dependentOn.indexOf(this.localRef) > -1; // Variable may be dynamically defined by the webview
    }
  }

  public isDependentOn(dependentOn: string[]) {
    // Static attribute never become invalid
    if (!this.isStaticAttribute()) return false;

    if (this.isSpecialRef()) {
      return dependentOn.indexOf(this.ref) > -1;
    }

    try {
      // TODO: Rework this to avoid exception
      const attribute = this.getBackingAttribute();
      return attribute.isDependentOn(dependentOn);
    } catch (e) {
      return dependentOn.indexOf(this.localRef) > -1; // Variable may be dynamically defined by the webview
    }
  }

  private isStaticAttribute() {
    return !(!this.ref && !this.localRef);
  }

  protected getBackingAttribute(): Attribute | undefined {
    let attr;

    if (this.localRef) {
      if (!this.localAttrContext)
        throw new Error(
          "Local ref cannot be resolve since this attribute is from the global attribute scope. ",
        );

      attr = this.localAttrContext.getAttribute(this.localRef);
    } else {
      // TODO: ref may be used for local attributes as well - local-ref is not working in AlphaWallet android so this check is required.
      //		 to confirm with James
      if (
        this.localAttrContext &&
        this.localAttrContext.hasAttribute(this.ref)
      ) {
        attr = this.localAttrContext.getAttribute(this.ref);
      } else {
        attr = this.tokenScript.getAttributes().getAttribute(this.ref);
      }
    }

    return attr;
  }

  private isSpecialRef() {
    return (
      ["tokenId", "ownerAddress", "contractAddress"].indexOf(this.ref) > -1
    );
  }

  protected abstract resolveValue(tokenContext?: ITokenIdContext): Promise<any>;
}
