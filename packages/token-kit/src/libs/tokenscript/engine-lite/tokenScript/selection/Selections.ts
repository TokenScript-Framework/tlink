// @ts-nocheck

import { TokenScript } from "../../tokenscript";
import { Selection } from "./Selection";

/**
 * A collection of Selection objects
 */
export class Selections implements Iterable<Selection | undefined> {
  private selections: { [attributeName: string]: Selection };

  constructor(
    private tokenScript: TokenScript,
    private parentElem: Element,
  ) {}

  /**
   * Get selection items as an object, keyed by name
   */
  getSelections(): { [attributeName: string]: Selection } {
    if (!this.selections) {
      this.selections = {};

      // Only get direct child selections. global & card level selections may have the same name within different scopes
      const attrElems = Array.prototype.slice
        .call(this.parentElem.children)
        .filter((elem: Element) => {
          return elem.tagName === "ts:selection";
        });

      if (attrElems.length > 0) {
        for (let i in attrElems) {
          const att = new Selection(this.tokenScript, attrElems[i]);

          this.selections[att.getName()!] = att;
        }
      }
    }

    return this.selections;
  }

  /**
   * Get selection by name
   * @param name
   */
  getSelection(name: string): Selection {
    if (!this.selections) this.getSelections();

    if (!this.selections[name])
      throw new Error("Could not find selection '" + name + "'");

    return this.selections[name];
  }

  [Symbol.iterator](): Iterator<Selection | undefined> {
    return Object.values(this.getSelections()).values();
  }
}
