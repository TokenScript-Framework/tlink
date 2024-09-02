// @ts-nocheck

import { computeAddress, keccak256 } from "ethers";
import { TokenScript } from "../../tokenscript";

export interface AttestationDefinitionMeta {
  name: string;
  image: string;
  description: string;
  attributes: { name: string; label: string; display_type: string | null }[];
}

export class AttestationDefinition {
  constructor(
    private tokenScript: TokenScript,
    private elem: Element,
  ) {}

  getTokenScript() {
    return this.tokenScript;
  }

  get name() {
    return this.elem.getAttribute("name")!;
  }

  get type() {
    return this.elem.getAttribute("type");
  }

  get meta(): AttestationDefinitionMeta {
    const meta = this.elem.getElementsByTagName("ts:meta")?.[0];

    if (!meta)
      return {
        name: this.tokenScript.getLabel(),
        image: "",
        description: "",
        attributes: [],
      };

    return {
      name:
        meta.getElementsByTagName("ts:name")?.[0]?.innerHTML ??
        this.tokenScript.getLabel(),
      image: meta.getElementsByTagName("ts:image")?.[0]?.innerHTML ?? "",
      description:
        meta.getElementsByTagName("ts:description")?.[0].innerHTML ?? "",
      attributes: Array.from(
        meta.getElementsByTagName("ts:attributeField"),
      ).map((elem) => {
        return {
          name: elem.getAttribute("name")!,
          label: elem.innerHTML,
          display_type: elem.getAttribute("display_type"),
        };
      }),
    };
  }

  get keys(): string[] {
    const keys: string[] = [];
    const keyElems = this.elem.getElementsByTagName("ts:key");

    for (const keyElem of keyElems) {
      keys.push(keyElem.innerHTML);
    }

    return keys;
  }

  /**
   * @deprecated in favour of collection fields
   */
  get eventId(): string {
    return this.elem.getElementsByTagName("ts:eventId")?.[0]?.innerHTML ?? null;
  }

  get collectionFields(): { name: string; value }[] {
    const collectionFields = this.elem.getElementsByTagName(
      "ts:collectionFields",
    )?.[0];

    if (!collectionFields) return [];

    return Array.from(
      collectionFields.getElementsByTagName("ts:collectionField"),
    ).map((elem) => {
      return {
        name: elem.getAttribute("name")!,
        value: elem.innerHTML,
      };
    });
  }

  get idFields(): string[] {
    const idElems = this.elem.getElementsByTagName("ts:idFields");

    if (!idElems.length) return [];

    return idElems[0].innerHTML.split(",") ?? [];
  }

  get schemaUID(): string {
    const easElem = this.elem.getElementsByTagName("ts:eas");
    if (easElem.length) {
      if (easElem[0].hasAttribute("schemaUID")) {
        return easElem[0].getAttribute("schemaUID")!;
      }
    }

    return "0x0000000000000000000000000000000000000000000000000000000000000000";
  }

  public calculateAttestationCollectionHashes(): string[] {
    const hashes: string[] = [];

    let schemaUID = this.schemaUID;

    if (schemaUID.indexOf("0x") === 0) schemaUID = schemaUID.substring(2);

    const encoder = new TextEncoder();

    for (let key of this.keys) {
      // If key is defined in XML without 0x, append it
      if (key.indexOf("0x") === -1) key = "0x" + key;

      key = computeAddress(key).substring(2).toLowerCase();

      const collectionParts: string[] = [];

      const collectionFields = this.collectionFields;

      if (collectionFields.length) {
        for (const field of collectionFields) {
          collectionParts.push(field.value);
        }
      } else if (this.eventId) {
        collectionParts.push(this.eventId);
      }

      const hashText = schemaUID + key + collectionParts.join("");

      const hash = keccak256(encoder.encode(hashText));

      hashes.push(hash);
    }

    return hashes;
  }
}
