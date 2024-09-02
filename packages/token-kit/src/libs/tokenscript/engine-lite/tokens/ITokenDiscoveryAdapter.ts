import {ITokenCollection} from "./ITokenCollection";

/**
 * Defines the interface for token discovery that is provided by the user-agent.
 * The engine will construct initial token data and send the request to the discovery adapter.
 * The user-agent then discovers token metadata & balances and returns the filled out data to the engine.
 * If the user-agent chooses to actively listen for changes in the data, they can also push updates directly
 * to the engine by calling TokenScript.setTokenMetadata(...);
 */
export interface ITokenDiscoveryAdapter {
	getTokens(initialTokenDetails: ITokenCollection[], refresh: boolean): Promise<ITokenCollection[]>
}
