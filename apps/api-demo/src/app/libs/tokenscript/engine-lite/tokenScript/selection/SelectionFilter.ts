// @ts-nocheck

import { ITokenIdContext, TokenScript } from "../../tokenscript";

/**
 * SelectionFilter represents the filter attribute on ts:selection element
 * This class contains logic for parsing the filter string and evaluating the condition/s to true or false
 */
export class SelectionFilter {
  // TODO: Handle full filter syntax that includes multiple conditions, bracketing, etc
  private attributeName: string;
  private conditionOperator: string;
  private conditionValue: string;

  constructor(
    private tokenScript: TokenScript,
    filter: string,
  ) {
    // Decode entity references
    filter = unescape(filter.replace(/&#x(\w{4});/g, "%u$1"));

    const matches = filter.match(/([a-zA-Z0-9]*)([=<>]*)([a-zA-Z0-9]*)/);

    if (!matches || matches.length < 4) throw new Error("Malformed selection filter");

    this.attributeName = matches[1];
    this.conditionOperator = matches[2];
    this.conditionValue = matches[3];
  }

  // TODO: Do special attributes such as tokenId need to be resolved too?
  //  Probably not since tokenId would need more complex filter logic with AND/OR logic and BETWEEN operator
  /**
   * Get the attribute value for the attribute specified in the filter
   * @param tokenContext
   * @private
   */
  private async getAttributeValue(tokenContext: ITokenIdContext) {
    const attributes = this.tokenScript.getAttributes();

    if (!attributes.hasAttribute(this.attributeName))
      throw new Error(
        "Selection filter references an undefined attribute, " +
          this.attributeName,
      );

    return attributes
      .getAttribute(this.attributeName)
      .getValue(false, false, false, tokenContext);
  }

  /**
   * Evaluate the filter condition
   * @param tokenContext
   */
  public async satisfiesFilter(tokenContext: ITokenIdContext) {
    const value = await this.getAttributeValue(tokenContext);
    const condValue = this.sanitiseConditionValue();

    switch (this.conditionOperator) {
      case "=":
        return value == condValue;
      case "<":
        return value < condValue;
      case ">":
        return value > condValue;
      default:
        throw new Error(
          "Filter condition " + this.conditionOperator + " is not implemented.",
        );
    }
  }

  /**
   * Convert boolean/number to proper type to ensure correct matching of conditions
   */
  public sanitiseConditionValue() {
    switch (this.conditionValue) {
      case "TRUE":
        return true;
      case "FALSE":
        return false;
      default:
        if (this.isNumeric(this.conditionValue))
          return BigInt(this.conditionValue);
    }

    return this.conditionValue;
  }

  /**
   * Determines if the value is numeric
   * @param value
   * @private
   */
  private isNumeric(value) {
    return /^-?\d+$/.test(value);
  }
}
