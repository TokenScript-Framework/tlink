// @ts-nocheck

import { ITokenIdContext, TokenScript } from "../../tokenscript";
import { Label } from "../Label";
import { SelectionFilter } from "./SelectionFilter";

/**
 * Selection represents a ts:selection element
 */
export class Selection {
  private label?: Label;
  private filter?: SelectionFilter;

  constructor(
    private tokenScript: TokenScript,
    private selectionDef: Element,
  ) {}

  /**
   * The unique name of the selection
   */
  public getName() {
    return this.selectionDef.getAttribute("name");
  }

  /**
   * The localised label for the selection message. This is shown when actions are disabled/excluded based on this selection
   */
  public getLabel() {
    if (!this.label) this.label = new Label(this.selectionDef);

    return this.label.getValue() ?? this.getName();
  }

  /**
   * Get the filter object for this selection
   * @private
   */
  private getFilter() {
    if (!this.filter)
      this.filter = new SelectionFilter(
        this.tokenScript,
        this.selectionDef.getAttribute("filter")!,
      );

    return this.filter;
  }

  /**
   * Determines if the selection criteria is met.
   * @param tokenContext
   */
  public isInSelection(tokenContext?: ITokenIdContext) {
    return this.getFilter().satisfiesFilter(tokenContext);
  }
}
