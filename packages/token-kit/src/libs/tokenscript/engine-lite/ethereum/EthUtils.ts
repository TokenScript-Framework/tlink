// @ts-nocheck

import {ethers} from "ethers";
import {BigNumber} from "bignumber.js";


export interface IEthersArgument {
	name: string,
	value: any,
	type: string,
	internalType: string,
	components?: {
		name: string,
		type: string,
		internalType: string
	}[]
}

/**
 * Various static utilities methods for integration with ethers.js
 */
export class EthUtils {

	/**
	 * Encode the parameter as type that can be consumed & encoded by ethers.js library
	 * @param type the tokenscript
	 * @param value
	 */
	public static encodeTransactionParameter(type: string, value: any){

		switch (type){

			case "bool":
				if (typeof value !== "boolean")
					value = Boolean(value);
				return value;

			case "string":
			case "address": // Address is presumed to be properly hex encoded OR is an ENS name
			case "struct":
				return value;
		}

		if (EthUtils.isIntType(type)){
			if (typeof value === "string"){
				value = BigInt(value);
			}
			return value;
		}

		if (type.indexOf("byte") === 0){
			if (value && (typeof value !== "string" || value.indexOf("0x") !== 0))
				value = ethers.hexlify(value);
			return value;
		}

		throw new Error("Ethereum argument encoding for type " + type + " is not defined");
	}

	/**
	 * Returns true if the argument type is int or uint
	 * @param type
	 * @private
	 */
	private static isIntType(type: string){
		const intIndex = type.indexOf("int");
		return intIndex === 0 || intIndex === 1;
	}

	/**
	 * Convert TokenScript output ('as' attribute) to a type accepted by ethers.js
	 * @param outputType
	 */
	public static tokenScriptOutputToEthers(outputType){

		switch (outputType){
			case "utf8":
				return "string";
		}

		return outputType;
	}

	/**
	 * Since ethers.js returns structs as an array with additional object properties,
	 * we need to convert it to a normal object for JSON encoding to work for alphanumeric keys.
	 * Otherwise, the card Javascript only receives numeric keys
	 * @param resultObject
	 */
	public static convertFunctionResult(resultObject: any){

		if (typeof resultObject !== "object" || !("toObject" in resultObject))
			return resultObject;

		try {
			const converted = {};

			for (let i in resultObject.toObject()){
				converted[i] = this.convertFunctionResult(resultObject[i]);
			}

			return converted;

		} catch (e){

			const converted = [];
			const resultArray = resultObject.toArray();

			for (let i=0; i<resultArray.length; i++){
				converted.push(this.convertFunctionResult(resultArray[i]));
			}

			return converted;
		}
	}

	/**
	 * Convert bigint and other illegal JSON types to JSON compatible values.
	 * @param data
	 */
	public static bigIntsToString(data: any){

		if (typeof data === "bigint")
			return data.toString();

		if (typeof data !== "object")
			return data;

		if (Array.isArray(data)){
			const res = [];

			for (let i=0; i<data.length; i++){
				res.push(this.bigIntsToString(data[i]))
			}

			return res;
		}

		const res = {};

		for (let i in data){
			res[i] = this.bigIntsToString(data[i]);
		}

		return res;
	}

	public static calculateDecimalValue(value: string|bigint|number, decimals: number = 18){
		if (!value)
			return 0;

		if (typeof value !== "string")
			value = value.toString();

		return (new BigNumber(value)).dividedBy(Math.pow(10, decimals)).toString();
	}

	public static calculateIntValue(value: string|number, decimals: number){
		if (!value)
			return 0;

		if (typeof value !== "string")
			value = value.toString();

		const convertedString = new BigNumber(value).multipliedBy(Math.pow(10, decimals)).integerValue().toString(10);

		return BigInt(convertedString);
	}
}
