import { Connector } from "wagmi"

const logoMap = {
  MetaMask: MetaMaskLogo,
  "Coinbase Wallet": CoinbaseLogo
}

const Nothing = () => {
  return null
}

export function ConnectorIcon({
  connector,
  className
}: {
  connector: Connector
  className?: string
}) {
  const Logo = logoMap[connector.name as keyof typeof logoMap] || Nothing
  return (
    <div className={className}>
      {connector.icon ? (
        <img src={connector.icon} alt={connector.name} className="w-7 h-7" />
      ) : (
        <Logo className="w-7 h-7" />
      )}
    </div>
  )
}
