import type { SVGProps } from "react"

function SvgComponent(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width={20}
      height={19}
      viewBox="0 0 20 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <path
        d="M10 1.938c-2.637 0-5.027 1.406-6.363 3.656-1.301 2.285-1.301 5.062 0 7.312A7.32 7.32 0 0010 16.562c2.602 0 4.992-1.37 6.328-3.656 1.3-2.25 1.3-5.027 0-7.312-1.336-2.25-3.726-3.657-6.328-3.657zm0 16.312c-3.234 0-6.188-1.688-7.805-4.5-1.617-2.777-1.617-6.188 0-9A9.02 9.02 0 0110 .25c3.2 0 6.152 1.723 7.77 4.5 1.617 2.813 1.617 6.223 0 9a8.933 8.933 0 01-7.77 4.5zm-1.406-6.188h.844v-2.25h-.844c-.492 0-.844-.351-.844-.843 0-.457.352-.844.844-.844h1.687c.457 0 .844.387.844.844v3.094h.281c.457 0 .844.386.844.843a.833.833 0 01-.844.844H8.594c-.492 0-.844-.352-.844-.844 0-.457.352-.844.844-.844zM10 7a1.11 1.11 0 01-1.125-1.125c0-.598.492-1.125 1.125-1.125.598 0 1.125.527 1.125 1.125C11.125 6.508 10.598 7 10 7z"
        fill="currentColor"
      />
    </svg>
  )
}

export default SvgComponent
