// @ts-nocheck

import { SecurityInfo } from "./security/SecurityInfo";
import { Card } from "./tokenScript/Card";
import { Contracts } from "./tokenScript/Contracts";
import { Label } from "./tokenScript/Label";
import { Meta } from "./tokenScript/Meta";
import { Origin } from "./tokenScript/Origin";
import { AttestationDefinitions } from "./tokenScript/attestation/AttestationDefinitions";
import { Selections } from "./tokenScript/selection/Selections";
import { ITokenCollection } from "./tokens/ITokenCollection";

export interface ITokenContext extends ITokenCollection {
  originId: string;
  selectedTokenIndex?: number; // TODO: Deprecate selectedTokenIndex
  selectedTokenId?: string;
}

export interface ITokenIdContext {
  originId: string;
  chainId: number;
  selectedTokenId?: string;
}

/**
 * The TokenScript object represents a single instance of a TokenScript.
 * The TS XML is parsed into various sub-objects on-demand that roughly reflect the structure of the XML.
 * This class contains various top-level methods for getting TokenScript data, showing TokenScript cards &
 * executing transactions
 */
export class TokenScript {
  private label?: Label;

  private meta?: Meta;

  private origins?: { [originName: string]: Origin };

  private contracts?: Contracts;

  private cards?: Card[];

  private attestationDefinitions?: AttestationDefinitions;

  private selections?: Selections;

  private securityInfo: SecurityInfo;

  constructor(public readonly xmlStr: string, public readonly tokenDef: XMLDocument) {
    this.securityInfo = new SecurityInfo(this);
  }

  /**
   * Returns the XML string for the TokenScript
   */
  public getXmlString() {
    return this.xmlStr;
  }

  /**
   * Returns the parsed XML DOM object for the TokenScript
   */
  public getXml() {
    return this.tokenDef;
  }

  /**
   * The SecurityInfo object related to this TokenScript
   */
  public getSecurityInfo() {
    return this.securityInfo;
  }

  /**
   * The common name of the TokenScript
   */
  public getName() {
    return this.tokenDef.documentElement.getAttribute("name");
  }

  /**
   * The label for the TokenScript
   */
  public getLabel() {
    if (!this.label) this.label = new Label(this.tokenDef.documentElement);

    return this.label.getValue() ?? this.getName() ?? "Unnamed TokenScript";
  }

  /**
   * The metadata for the TokenScript
   */
  public getMetadata() {
    if (!this.meta) this.meta = new Meta(this.tokenDef.documentElement);

    return this.meta;
  }

  /**
   * An array of cards for the TokenScript
   * @param tokenOrigin Use the specified origin name if provided, otherwise fallback to current context origin
   * @param onboardingCards
   */
  public getCards(tokenOrigin?: string, onboardingCards = false): Card[] {
    if (!this.cards) {
      let cardsXml =
        this.tokenDef.documentElement.getElementsByTagName("ts:card");

      this.cards = [];

      for (let i in cardsXml) {
        if (!cardsXml.hasOwnProperty(i)) continue;

        const card = new Card(this, cardsXml[i]);

        this.cards.push(card);
      }
    }

    // Only return cards available for the specified token origins
    let cards = this.cards.filter(
      (card) =>
        (!onboardingCards && card.type !== "onboarding") ||
        (onboardingCards && card.type === "onboarding"),
    );

    if (tokenOrigin) {
      cards = cards.filter((card) => {
        return (
          card.origins.length === 0 || card.origins.indexOf(tokenOrigin) > -1
        );
      });
    }

    return cards;
  }

  /**
   * Contracts for the TokenScript
   * @param originsOnly
   */
  public getContracts() {
    if (!this.contracts) {
      this.contracts = new Contracts(this);
    }

    return this.contracts;
  }

  public getOrigins() {
    if (!this.origins) {
      const origins =
        this.tokenDef.documentElement.getElementsByTagName("ts:origins");

      this.origins = {};

      for (let i in origins[0].children) {
        const origin = origins[0].children[i];

        if (!origin.tagName) continue;

        if (origin.tagName == "ts:ethereum") {
          const contractName = origin.getAttribute("contract");
          this.origins[contractName!] = new Origin(
            this,
            contractName!,
            "contract",
          );
        } else if (origin.tagName == "ts:attestation") {
          const attestDefName = origin.getAttribute("name");
          this.origins[attestDefName!] = new Origin(
            this,
            attestDefName!,
            "attestation",
          );
        } else {
          console.warn(
            "Token origin with tag " + origin.tagName + " is not supported",
          );
        }
      }
    }

    return this.origins;
  }

  /**
   * Returns the viewContent with the provided name.
   * Multiple actions can share the same HTML/JS/CSS code to reduce duplication in the XML
   * @param name The viewContent name as defined by the "name" object in the XML
   */
  public getViewContent(name: string) {
    const viewContents =
      this.tokenDef.documentElement.getElementsByTagName("ts:viewContent");

    for (let i in viewContents) {
      if (viewContents[i].getAttribute("name") === name) {
        return viewContents[i].children;
      }
    }

    return null;
  }

  /**
   * The attestation definitions defined in the TokenScripts
   */
  public getAttestationDefinitions(originsOnly = true) {
    if (!this.attestationDefinitions) {
      this.attestationDefinitions = new AttestationDefinitions(
        this,
        this.tokenDef.documentElement,
      );
    }

    if (originsOnly) this.attestationDefinitions.getOriginDefinitions();

    return this.attestationDefinitions;
  }

  /**
   * Selection filters for the TokenScript
   * These are used to disable cards/actions based on some conditions - such as disabling an action for a certain range of tokens
   */
  public getSelections() {
    if (!this.selections) {
      this.selections = new Selections(this, this.tokenDef.documentElement);
    }

    return this.selections;
  }

  /**
   * Returns the ASN module definition by name
   * ASN module definitions are used to specify the schema that is needed to decode ASN encoded data
   * Currently it is only used for ethereum event decoding, but it will be used later for attestations (off-chain tokens)
   * @param name
   */
  public getAsnModuleDefinition(name) {
    const modules = this.tokenDef.getElementsByTagName("asnx:module")[0];
    return modules.querySelector("[name=" + name + "]");
  }
}
