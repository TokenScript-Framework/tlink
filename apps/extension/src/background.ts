chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  console.log('on message', msg, sender);
  if (!sender.tab || !sender.tab.id) {
    return null;
  }
  if (msg.type === 'getSelectedWallet') {
    chrome.storage.local.get(['selectedWallet'], (storage) => {
      sendResponse(storage.selectedWallet);
    });
    return true;
  }

  if (!msg.wallet) return false;
  handleWalletCommunication(sender.tab.id, msg.type, msg.wallet, msg.payload)
    .then((res) => {
      sendResponse(res);
    })
    .catch((err) => {
      console.error('error handling message', err);
    });

  return true;
});

async function handleWalletCommunication(
  tabId: number,
  type: string,
  wallet: string,
  payload: object,
) {
  console.log('type', type);
  console.log('wallet', wallet);
  console.log('payload', payload);

  //  case "eth_requestAccounts":
  //  case "eth_sendTransaction":

  // TODO:
  //  case "eth_accounts":
  //  case "eth_getCode":
  //  case "eth_chainId":
  //  case "net_version":
  //  case "eth_blockNumber":
  //  case "eth_estimateGas":
  //  case "eth_getTransactionByHash":
  //  case "eth_getTransactionReceipt":
  //  case "eth_getTransactionCount":
  //  case "personal_sign":
  //  case "eth_call":
  //  case "eth_signTypedData":
  //  case "eth_signTypedData_v4":
  //  case "eth_getBlockByNumber":
  //  case "wallet_switchEthereumChain"

  if (type === 'connect') {
    console.log('connecting wallet', wallet);
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId: tabId },
      func: async () => {
        // @ts-ignore
        const provider = window.ethereum;
        const accounts = await provider.request({
          method: 'eth_requestAccounts',
        });
        return accounts[0];
      },
    });
    console.log('result', res);
    return res[0].result;
  } else if (type === 'sign_message') {
    // // @ts-ignore
    // console.log('signing message', payload.message);
    // const res = await chrome.scripting.executeScript({
    //   world: 'MAIN',
    //   target: { tabId: tabId },
    //   func: async (message: string) => {
    //     const provider =
    //       // @ts-ignore
    //       wallet === 'solflare' ? window.solflare : window.solana;
    //     const textToSign = new TextEncoder().encode(message);
    //     const res = await provider.signMessage(textToSign);
    //     return res;
    //   },
    //   // @ts-ignore
    //   args: [payload.message, wallet],
    // });
    // return res[0].result;
  } else if (type === 'eth_sendTransaction') {
    // @ts-ignore
    console.log('signing transaction', wallet, payload.txData);
    const res = await chrome.scripting.executeScript({
      world: 'MAIN',
      target: { tabId: tabId },
      func: async (transaction: any, wallet) => {
        try {
          // @ts-ignore
          const provider = window.ethereum;
          const res = await provider.request({
            method: 'eth_sendTransaction',
            params: [transaction],
          });
          return res;
        } catch (e: any) {
          console.log('error', e);
          return { error: e.message ?? 'Unknown error' };
        }
      },
      // @ts-ignore
      args: [payload.txData, wallet],
    });
    return res[0].result;
  }
}
