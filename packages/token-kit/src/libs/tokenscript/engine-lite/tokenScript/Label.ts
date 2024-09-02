// @ts-nocheck

/**
 * The label element can be placed in various places in the TokenScript XML.
 * It supports multi-language & plural features
 */
export class Label {

	private readonly label: string | {[plural: string]: string};

	constructor(private parentElem: Element) {

		const labels = Array.prototype.slice.call(this.parentElem.children).filter((elem: Element) => {
			return elem.tagName === "ts:label"
		});

		if (labels.length > 0){

			const elements: Element[] = [].slice.call(labels[0].children);

			// TODO: get label based on locale
			const langLabels = elements.filter((elem) => elem.getAttribute("xml:lang") === "en")

			if (langLabels.length){

				if (langLabels[0].tagName === "ts:plurals" && langLabels[0].children.length > 0){

					this.label = {};

					for (let i of langLabels[0].children){
						const plural = langLabels[0].children[0];
						this.label[plural.getAttribute("quantity")!] = plural.textContent!;
					}

				} else {
					this.label = langLabels[0].textContent!;
				}
			}
		}
	}

	/**
	 * The applicable value of the label, based on the pluralQty provided
	 * @param pluralQty
	 */
	public getValue(pluralQty?: number){

		if (!this.label)
			return null;

		if (typeof this.label === "string")
			return this.label;

		// TODO: Implement other plural values
		if (pluralQty > 1 && this.label["other"])
			return this.label["other"];

		return this.label["one"];
	}
}
