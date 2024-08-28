// @ts-nocheck

import { ITokenIdContext, TokenScript } from "../../tokenscript";
import { Attributes } from "../Attributes";
import { AbstractDependencyBranch } from "./AbstractDependencyBranch";

export class AttributeReference extends AbstractDependencyBranch {
  private fullPath: string;

  constructor(
    tokenScript: TokenScript,
    argDef: Element,
    localAttrContext?: Attributes,
  ) {
    super(tokenScript, localAttrContext);

    this.fullPath = argDef.getAttribute("ref");
    const dotPosition = this.fullPath.indexOf(".");
    this.ref =
      dotPosition > -1
        ? this.fullPath.substring(0, dotPosition)
        : this.fullPath;
  }

  protected resolveValue(tokenContext?: ITokenIdContext): Promise<any> {
    new Error("Not intended for value resolution");
    return Promise.resolve(undefined);
  }
}
