import { ActionConfig, BlockchainIds, TransactionData } from '@repo/blinks';
import { setupTwitterObserver } from '@repo/blinks/ext/twitter';
import '@repo/blinks/index.css';

const adapter = (wallet: string) =>
  new ActionConfig(import.meta.env.VITE_RPC_URL, {
    signTransaction: (txData: TransactionData) =>
      chrome.runtime.sendMessage({
        type: 'eth_sendTransaction',
        wallet,
        payload: {
          txData,
        },
      }),
    connect: () =>
      chrome.runtime.sendMessage({
        wallet,
        type: 'connect',
      }),
    metadata: {
      supportedBlockchainIds: [BlockchainIds.SOLANA_MAINNET],
    },
  });

function initTwitterObserver() {
  chrome.runtime.sendMessage({ type: 'getSelectedWallet' }, (wallet) => {
    if (wallet) {
      setupTwitterObserver(adapter(wallet));
    }
  });
}

initTwitterObserver();
