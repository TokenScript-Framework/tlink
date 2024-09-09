import { BlockchainIds } from '../../utils/caip-2.ts';
import type { Action } from './Action.ts';

/**
 * Max spec version the tlink client supports.
 */
export const MAX_SUPPORTED_ACTION_VERSION = '1';

/**
 * Baseline action version to be used when not set by action provider.
 * Defaults to latest release that doesn't support versioning.
 */
export const BASELINE_ACTION_VERSION = '2.2';
/**
 * Baseline blockchain IDs to be used when not set by action provider.
 * Defaults to Solana mainnet.
 */
export const BASELINE_ACTION_BLOCKCHAIN_IDS = [BlockchainIds.SOLANA_MAINNET];

type IsVersionSupportedParams = {
  actionVersion: string;
  supportedActionVersion: string;
};

type IsBlockchainIdSupportedParams = {
  actionBlockchainIds: string[];
  supportedBlockchainIds: string[];
};

export type ActionSupportability =
  | {
      isSupported: true;
    }
  | {
      isSupported: false;
      message: string;
    };

export type ActionSupportStrategy = (
  action: Action,
) => Promise<ActionSupportability>;

/**
 * Default implementation for checking if an action is supported.
 * Checks if the action version and the action blockchain IDs are supported by tlink.
 * @param action Action.
 *
 * @see {isVersionSupported}
 */
export const defaultActionSupportStrategy: ActionSupportStrategy = async (
  action,
) => {
  const { version: actionVersion, blockchainIds: actionBlockchainIds } =
    action.metadata;

  // Will be displayed in the future once we remove backward compatibility fallbacks for blockchains and version
  if (
    !actionVersion ||
    !actionBlockchainIds ||
    actionBlockchainIds.length === 0
  ) {
    return {
      isSupported: false,
      message:
        'Action compatibility metadata is not set. Please contact the action provider.',
    };
  }

  const supportedActionVersion = MAX_SUPPORTED_ACTION_VERSION;

  const versionSupported = isVersionSupported({
    actionVersion,
    supportedActionVersion,
  });

  if (!versionSupported) {
    return {
      isSupported: false,
      message: `Action version ${actionVersion} are not supported by your tlink client.`,
    };
  }

  if (!versionSupported) {
    return {
      isSupported: false,
      message: `Action version ${actionVersion} is not supported by your tlink client.`,
    };
  }

  return {
    isSupported: true,
  };
};

/**
 * Check if the action version is supported by tlink.
 * @param supportedActionVersion The version the tlink supports.
 * @param actionVersion The version of the action.
 *
 * @returns `true` if the action version is less than or equal to the supported ignoring patch version, `false` otherwise.
 */
export function isVersionSupported({
  supportedActionVersion,
  actionVersion,
}: IsVersionSupportedParams): boolean {
  return true;
  // TODO: implement
  return compareSemverIgnoringPatch(actionVersion, supportedActionVersion) <= 0;
}

function compareSemverIgnoringPatch(v1: string, v2: string): number {
  const [major1, minor1] = v1.split('.').map(Number);
  const [major2, minor2] = v2.split('.').map(Number);
  if (major1 !== major2) {
    return major1 - major2;
  } else if (minor1 !== minor2) {
    return minor1 - minor2;
  }
  return 0;
}
