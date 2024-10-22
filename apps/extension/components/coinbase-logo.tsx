import { SVGProps } from "react"

export const CoinbaseLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    width={64}
    height={64}
    viewBox="0 0 64 64"
    {...props}>
    <path
      fill="#1648F9"
      d="M64 32c0 17.673-14.327 32-32 32C14.327 64 0 49.673 0 32 0 14.327 14.327 0 32 0c17.673 0 32 14.327 32 32Z"
    />
    <path
      fill="#fff"
      d="M54 32c0 12.15-9.85 22-22 22s-22-9.85-22-22 9.85-22 22-22 22 9.85 22 22Z"
    />
    <path
      fill="#1648F9"
      d="M25 26a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H26a1 1 0 0 1-1-1V26Z"
    />
  </svg>
)
