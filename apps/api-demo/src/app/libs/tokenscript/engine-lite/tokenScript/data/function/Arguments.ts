// @ts-nocheck

import { TokenScript } from "../../../tokenscript";
import { Attributes } from "../../Attributes";
import { Argument } from "./Argument";

/**
 * A collection of arguments for the ethereum function or transaction.
 */
export class Arguments implements Iterable<Argument | undefined> {
  private arguments: Argument[];

  constructor(
    private tokenScript: TokenScript,
    private parentElem: Element,
    private localAttrContext?: Attributes,
  ) {}

  /**
   * Get the array of arguments.
   * The arguments are in the exact order that the smart contract expects.
   */
  getArguments(): Argument[] {
    if (!this.arguments) {
      this.arguments = [];

      const dataArgs = this.parentElem.getElementsByTagName("ts:data");

      if (dataArgs.length === 0) return [];

      const argElements = dataArgs[0].children;

      if (argElements.length === 0) return [];

      for (let i in argElements) {
        if (!argElements.hasOwnProperty(i)) continue;

        const argElem = argElements[i];

        this.arguments.push(
          new Argument(this.tokenScript, argElem, null, this.localAttrContext),
        );
      }
    }

    return this.arguments;
  }

  [Symbol.iterator](): Iterator<Argument | undefined> {
    return this.getArguments().values();
  }
}
