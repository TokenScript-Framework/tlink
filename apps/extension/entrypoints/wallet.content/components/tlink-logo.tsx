import { SVGProps } from "react"

export const TlinkLogo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width={100}
    height={71}
    viewBox="0 0 100 71"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}>
    <g clipPath="url(#a)">
      <path d="M100 1.042H89.463v69.669H100V1.042Z" fill="#0019FF" />
      <path
        d="M79.43 40.098v5.857L44.582 63.92v-9.09L68.39 43.117 44.583 31.439v-9.126L79.43 40.098ZM0 45.811v-5.856l34.883-17.966v9.127L11.04 42.793l23.843 11.713v9.09L0 45.812Z"
        fill="#000"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h100v70.37H0z" />
      </clipPath>
    </defs>
  </svg>
)
