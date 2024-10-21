import { SVGProps } from "react"

export const Spinner = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    fill="none"
    viewBox="0 0 80 80"
    {...props}>
    <mask
      id="mask0_521_14"
      style={{ maskType: "luminance" }}
      width="40"
      height="40"
      x="37"
      y="3"
      maskUnits="userSpaceOnUse">
      <path
        fill="#fff"
        d="M75.623 43c.773 0 1.403-.627 1.376-1.4A40.025 40.025 0 0038.401 3C37.627 2.975 37 3.604 37 4.378s.627 1.398 1.4 1.427A37.221 37.221 0 0174.197 41.6c.029.774.653 1.401 1.427 1.401z"></path>
    </mask>
    <g mask="url(#mask0_521_14)">
      <path
        stroke="url(#paint0_linear_521_14)"
        strokeWidth="4"
        d="M75.623 43c.773 0 1.403-.627 1.376-1.4A40.025 40.025 0 0038.401 3C37.627 2.975 37 3.604 37 4.378s.627 1.398 1.4 1.427A37.221 37.221 0 0174.197 41.6c.029.774.653 1.401 1.427 1.401z"></path>
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_521_14"
        x1="76.071"
        x2="38.429"
        y1="43"
        y2="2.976"
        gradientUnits="userSpaceOnUse">
        <stop stopColor="#4779FF"></stop>
        <stop offset="1" stopColor="#4779FF" stopOpacity="0"></stop>
      </linearGradient>
    </defs>
  </svg>
)
