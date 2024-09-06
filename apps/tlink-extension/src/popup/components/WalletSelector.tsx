import type { ReactNode } from "react"

import ArrowFromSquareIcon from "../icons/ArrowFromSquareIcon"
import { Checkbox } from "./Checkbox"
import MetaMaskLogo from "./MetaMaskLogo"

enum Wallets {
  MetaMask = "metamask"
}
interface WalletProps {
  title: string
  subtitle?: string
  icon: ReactNode
}
const WalletSelect = ({
  title,
  subtitle,
  icon,
  isSelected,
  onChange
}: WalletProps & {
  isSelected?: boolean
  onChange?: (nextVal: boolean) => void
}) => {
  const borderColor = isSelected
    ? "border-accent-brand"
    : "border-secondary hover:border-[#C4C6C8]"
  const onClick = () => {
    onChange?.(!isSelected)
  }
  return (
    <label className="cursor-pointer items-center w-full" onClick={onClick}>
      <input type="hidden" checked={isSelected} onChange={onClick} />
      <div
        className={
          "border px-4 py-3 flex flex-row items-center gap-3 rounded-lg group " +
          borderColor
        }>
        {icon}
        <div className="flex flex-col flex-1">
          <span className="text-text font-medium">{title}</span>
          {subtitle && (
            <span className="text-caption font-medium text-quaternary">
              {subtitle}
            </span>
          )}
        </div>
        <Checkbox checked={isSelected} />
      </div>
    </label>
  )
}

const WalletLink = ({
  title,
  subtitle,
  icon,
  url
}: WalletProps & {
  url: string
}) => (
  <button
    className={
      "border px-4 py-3 flex flex-row items-center gap-3 rounded-lg hover:border-[#C4C6C8]"
    }
    onClick={() =>
      chrome.tabs.create({
        url
      })
    }>
    {icon}
    <div className="flex flex-col flex-1 items-start">
      <span className="text-text font-medium">{title}</span>
      {subtitle && (
        <span className="text-caption font-medium text-quaternary">
          {subtitle}
        </span>
      )}
    </div>
    <ArrowFromSquareIcon className="text-icon-secondary" />
  </button>
)

export const WalletSelector = ({
  selectedWallet,
  setSelectedWallet
}: {
  selectedWallet?: string | null
  setSelectedWallet: (w: string | null) => void
}) => {
  function selectWallet(wallet: string) {
    setSelectedWallet(wallet)
  }

  function unselectWallet() {
    setSelectedWallet(null)
  }
  const isWalletMetaMask = selectedWallet === Wallets.MetaMask
  return (
    <div className="flex flex-col flex-1 gap-2 w-full">
      <WalletSelect
        isSelected={isWalletMetaMask}
        title="MetaMask"
        subtitle="The most popular wallet for Ethereum"
        icon={<MetaMaskLogo className="w-8 h-8" />}
        onChange={(isChecked: boolean) =>
          isChecked ? selectWallet(Wallets.MetaMask) : unselectWallet()
        }
      />
    </div>
  )
}
