// @ts-nocheck

import {EthUtils} from "../ethereum/EthUtils";
import {TokenScript} from "../tokenscript";
import {Attributes} from "./Attributes";
import {Contract} from "./Contract";
import {Argument} from "./data/function/Argument";
import {Arguments} from "./data/function/Arguments";

interface ITransactionInfo {
	as: string,
	contract: Contract,
	contractName: string,
	function: string
	args: Argument[],
	value: Argument | null
}

/**
 * Transaction represents the ethereum:transaction XML tag that can be included within ts:token or ts:card elements.
 * The constructor pulls various information from the XML element and constructs Argument objects for the transaction.
 * The argument values are resolved when executing a transaction in TokenScript.executeTransaction(...)
 */
export class Transaction {

	private contract: Contract;

	private transaction?: ITransactionInfo;

	constructor(
		private tokenScript: TokenScript,
		private transactionDef: Element,
		private localAttrContext?: Attributes
	) {

		const transInfo = transactionDef.getElementsByTagName("ethereum:transaction");

		if (!transInfo){
			return;
		}

		const contractName = transInfo[0].getAttribute("contract")!;

		let as = EthUtils.tokenScriptOutputToEthers(transInfo[0].getAttribute("as"));

		this.transaction = {
			as: as,
			contract: this.tokenScript.getContracts().getContractByName(contractName),
			contractName: contractName,
			function: transInfo[0].getAttribute("function")!,
			args: new Arguments(this.tokenScript, transInfo[0], this.localAttrContext).getArguments(),
			value: this.getValueArg(transInfo[0])
		};
	}

	/**
	 * Fetches the ethereum value argument for the transaction
	 * This is the eth which is sent with the transaction and can be hardcoded or resolved from an attribute
	 * or special reference like any other transaction argument
	 * @param transInfo
	 * @private
	 */
	private getValueArg(transInfo: Element){

		const valueElem = transInfo.getElementsByTagName("ethereum:value");

		if (valueElem.length === 0)
			return null;

		return new Argument(this.tokenScript, valueElem[0], "uint256", this.localAttrContext);
	}

	public getTransactionInfo() {
		return this.transaction;
	};
}
