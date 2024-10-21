import { useWalletClient } from "wagmi"

export function GlobalApiSetup() {
  const { data } = useWalletClient()

  useEffect(() => {
    window.tlink = data
  }, [data])

  return null
}
