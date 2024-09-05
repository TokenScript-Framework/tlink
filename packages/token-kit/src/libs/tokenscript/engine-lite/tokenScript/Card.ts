import { ITokenIdContext, TokenScript } from "../tokenscript";
import { Label } from "./Label";
import { Transaction } from "./Transaction";

export type CardType = "onboarding" | "token" | "action" | "activity";

export class Card {
  private _label?: Label;
  private transaction?: Transaction;

  constructor(
    private tokenScript: TokenScript,
    private cardDef: Element,
  ) {}

  /**
   * The label of the card
   */
  get label() {
    if (!this._label) this._label = new Label(this.cardDef);

    return this._label.getValue() ?? "Unnamed Card";
  }

  /**
   * Name of the card
   */
  get name() {
    return this.cardDef.getAttribute("name");
  }

  /**
   * The type of card. This can be token, action or activity
   */
  get type(): CardType {
    return this.cardDef.getAttribute("type") as CardType;
  }

  /**
   * References a ts:selection element. Tokens matching the selection criteria will be excluded from being able to use this card.
   */
  get exclude() {
    return this.cardDef.getAttribute("exclude");
  }

  /**
   * References the token origins that the card is available for as a space-separated list
   */
  get origins() {
    const origins = this.cardDef.getAttribute("origins");
    if (!origins) return []; // Attribute not specified = card available for all origins in the TokenScript

    return origins.split(" ");
  }

  /**
   * The button class of the card, used to determine the styles to apply to the card button
   */
  get buttonClass() {
    return this.cardDef.getAttribute("buttonClass");
  }

  /**
   * The HTML web content associated with the card
   */
  get view(): Element {
    return this.cardDef.getElementsByTagName("ts:view")[0];
  }

  /**
   * The URL fragment (document.location.hash) that is applied to the view when the code is loaded.
   * This allows single page apps defined in viewContent to use hash routing to load the correct page
   */
  get urlFragment() {
    return this.view.getAttribute("urlFragment");
  }

  get uiButton() {
    return this.view.hasAttribute("uiButton")
      ? this.view.getAttribute("uiButton") === "true"
      : true;
  }

  get fullScreen() {
    return this.view.getAttribute("fullScreen") === "true";
  }

  /**
   * Determines whether the view is to be loaded from a URL or from embedded content in ts:view
   */
  get isUrlView() {
    return this.url;
  }

  /**
   * Gets the URL to load remote view content
   */
  get url() {
    return this.view.getAttribute("url");
  }

  // TODO: Inner card selections are not used in any TokenScript example, do they need to be supported?
  //		 If not then the schema needs to be updated to prohibit it
  /*public getSelections(){

		if (!this.selections){
			this.selections = new Selections(this.tokenScript, this.cardDef);
		}

		return this.selections;
	}*/

  /**
   * Returns true if the action is allowed, or a reason string if disabled.
   * The reason string is the label of the ts:selection element in the TokenScript file
   * @param tokenContext The token context for which to determine card availability, falls back to the current token context
   */
  public async isEnabledOrReason(tokenContext?: ITokenIdContext) {
    if (tokenContext && !this.isAvailableForOrigin(tokenContext.originId))
      return false;

    if (!this.exclude) return true;

    const selection = this.tokenScript
      .getSelections()
      .getSelection(this.exclude);

    if (await selection.isInSelection(tokenContext)) {
      return selection.getLabel();
    }

    return true;
  }

  /**
   * Is available for origin
   */
  public isAvailableForOrigin(originId: string) {
    return this.origins.length === 0 || this.origins.indexOf(originId) > -1;
  }

  /**
   * Get the transaction record associated with this card
   */
  getTransaction() {
    if (!this.transaction) {
      const transactionsXml =
        this.cardDef.getElementsByTagName("ts:transaction");

      if (transactionsXml.length > 0)
        this.transaction = new Transaction(
          this.tokenScript,
          transactionsXml[0],
        );
    }

    return this.transaction;
  }
}
