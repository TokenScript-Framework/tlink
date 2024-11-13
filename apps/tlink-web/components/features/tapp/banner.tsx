'use client'

import { useEffect, useRef, useState } from 'react'

export function TappBanner() {
  const svgRef = useRef<SVGSVGElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [time, setTime] = useState(0)

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        })
      }
    }

    window.addEventListener('resize', updateDimensions)
    updateDimensions()

    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  useEffect(() => {
    let animationFrameId: number

    const animate = () => {
      setTime((prevTime) => prevTime + 0.002) // Slow animation speed
      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId)
      }
    }
  }, [])

  const generateGrid = () => {
    const lines = []
    const rows = 30 // Increased density
    const cols = 40 // Increased density
    const cellWidth = dimensions.width / cols
    const cellHeight = dimensions.height / rows

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        const centerX = dimensions.width / 2
        const centerY = dimensions.height / 2

        // Calculate position
        const x = j * cellWidth
        const y = i * cellHeight

        // Calculate angle based on distance from center
        const dx = x - centerX
        const dy = y - centerY
        const distance = Math.sqrt(dx * dx + dy * dy)
        const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY)
        const angle = (distance / maxDistance) * Math.PI * 0.5

        // Add animation
        const animationOffset = Math.sin(distance * 0.05 + time) * 5

        // Calculate line endpoints
        const lineLength = 15 // Slightly shorter lines for denser grid
        const rotation = Math.atan2(dy, dx)
        const x1 =
          x - Math.cos(rotation + angle) * (lineLength / 2 + animationOffset)
        const y1 =
          y - Math.sin(rotation + angle) * (lineLength / 2 + animationOffset)
        const x2 =
          x + Math.cos(rotation + angle) * (lineLength / 2 + animationOffset)
        const y2 =
          y + Math.sin(rotation + angle) * (lineLength / 2 + animationOffset)

        lines.push(
          <line
            key={`${i}-${j}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeWidth="1"
            strokeOpacity="0.2"
          />,
        )
      }
    }

    return lines
  }

  return (
    <div className="absolute inset-0 bg-black">
      <svg
        ref={svgRef}
        width={dimensions.width}
        height={dimensions.height}
        className="text-white"
      >
        {dimensions.width > 0 && dimensions.height > 0 && generateGrid()}
      </svg>
    </div>
  )
}
