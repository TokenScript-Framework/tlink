// @ts-nocheck

/**
 * The meta element is placed in the ts:token element and provides metadata details for the tokenscript file.
 * Currently, description & aboutUrl are used.
 * It supports multi-language
 */
export class Meta {

	private static META_TAGS = ["description", "aboutUrl", "iconUrl", "imageUrl", "backgroundImageUrl"];

	private readonly meta: {[metaTag: string]: string|any} = {};

	constructor(private parentElem: Element) {

		const meta = parentElem.getElementsByTagName("ts:meta");

		if (meta.length && meta[0].children.length){

			for (const tag of Meta.META_TAGS) {

				const elements: Element[] = [].slice.call(meta[0].getElementsByTagName("ts:" + tag));

				if (!elements.length)
					continue;

				// TODO: get meta based on locale
				const langLabels = elements.filter((elem) => elem.getAttribute("xml:lang") === "en")

				this.meta[tag] = langLabels.length ? langLabels[0].textContent : elements[0].textContent;
			}

			// Collect environment variables
			this.meta.env = {};

			const elements: Element[] = [].slice.call(meta[0].getElementsByTagName("ts:env"));

			for (const elem of elements){
				this.meta.env[elem.getAttribute("name")!] = elem.textContent;
			}
		}
	}

	/**
	 * The applicable value of the meta, based on the pluralQty provided
	 * @param name
	 */
	public getValue(name: string){

		if (!this.meta[name])
			return null;

		return this.meta[name];
	}

	get description(){
		return this.getValue("description")
	}

	get aboutUrl(){
		return this.getValue("aboutUrl")
	}

	get iconUrl(){
		return this.getValue("iconUrl")
	}

	get imageUrl(){
		return this.getValue("imageUrl")
	}

	get backgroundImageUrl(){
		return this.getValue("backgroundImageUrl")
	}

	get env(){
		return this.getValue("env")
	}
}
