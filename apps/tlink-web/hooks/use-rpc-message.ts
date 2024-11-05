/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useCallback } from 'react'
import { useWalletClient } from 'wagmi'

export const useRpcMessage = () => {
  const { data: walletClient } = useWalletClient()

  const handleRpcMessage = useCallback(
    async (method: string | any, params?: any) => {
      if (!walletClient) {
        return
      }

      if (!method) {
        return
      }

      try {
        switch (method) {
          case 'eth_accounts':
          case 'eth_requestAccounts':
          case 'eth_getCode':
          case 'eth_chainId':
          case 'net_version':
          case 'eth_blockNumber':
          case 'eth_estimateGas':
          case 'eth_sendTransaction':
          case 'eth_getTransactionByHash':
          case 'eth_getTransactionReceipt':
          case 'eth_getTransactionCount':
          case 'personal_sign':
          case 'eth_call':
          case 'eth_signTypedData':
          case 'eth_signTypedData_v4':
          case 'eth_getBlockByNumber':
          case 'wallet_switchEthereumChain': {
            const response = await walletClient.request({ method, params })
            return response
          }

          default:
            return null
        }
      } catch (e: any) {
        const innerError = e.walk()

        if (innerError) e = innerError

        throw {
          code: e.data?.code ?? e.code,
          message: e.message + (e.data?.message ? ' ' + e.data?.message : ''),
        }
      }
    },
    [walletClient],
  )

  return { handleRpcMessage }
}
