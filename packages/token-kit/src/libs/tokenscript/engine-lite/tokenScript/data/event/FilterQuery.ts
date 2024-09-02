// @ts-nocheck

import { ITokenIdContext, TokenScript } from "../../../tokenscript";
import { Attributes } from "../../Attributes";
import { FilterValue } from "./FilterValue";

/**
 * FilterQuery represent an ethereum event filter, which is used within the ethereum:event attribute source.
 * It allows special reference and attribute values to be used to select a specific event record.
 */
export class FilterQuery {
  private params: URLSearchParams;
  private dynamicValues: { [key: string]: FilterValue } = {};

  constructor(
    private tokenScript: TokenScript,
    filter: string,
    private localAttrContext?: Attributes,
  ) {
    this.params = new URLSearchParams(filter);

    for (let [key, value] of this.params.entries()) {
      const match = value.match(/^\$\{(.*)\}/);

      if (match && match[1])
        this.dynamicValues[key] = new FilterValue(
          tokenScript,
          match[1],
          null,
          localAttrContext,
        );
    }
  }

  /**
   * Determines whether the filter contains a value for a specific field in the event schema
   * @param key
   */
  public has(key: string) {
    return this.params.has(key);
  }

  /**
   * Gets the value for a specific event field
   * @param key
   * @param tokenContext
   */
  public async getValue(key: string, tokenContext?: ITokenIdContext) {
    if (this.dynamicValues[key]) {
      return await this.dynamicValues[key].getValue(tokenContext);
    }

    return this.params.get(key);
  }

  /**
   * Gets dynamic values for the filter query. Used for attribute dependency calculation
   */
  public getDynamicFilterValues() {
    return Object.values(this.dynamicValues);
  }
}
