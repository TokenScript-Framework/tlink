import { ActionConfig, BlockchainIds, TransactionPayload } from '@repo/tlinks';
import { setupTwitterObserver } from '@repo/tlinks/ext/twitter';
import '@repo/tlinks/index.css';

const adapter = (wallet: string) =>
  new ActionConfig({
    signTransaction: (payload: TransactionPayload) =>
      chrome.runtime.sendMessage({
        type: 'eth_sendTransaction',
        wallet,
        payload,
      }),
    connect: () => chrome.runtime.sendMessage({ wallet, type: 'connect' }),
    metadata: { supportedBlockchainIds: [BlockchainIds.SOLANA_MAINNET] },
  });

function initTwitterObserver() {
  chrome.runtime.sendMessage({ type: 'getSelectedWallet' }, (wallet) => {
    if (wallet) {
      setupTwitterObserver(adapter(wallet));
    }
  });
}

initTwitterObserver();
