'use client'

import { useEffect, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

interface ScoreRingProps {
  score: number
  size?: number
}

function getScoreLabel(score: number): string {
  if (score >= 80) return 'Eccellente'
  if (score >= 60) return 'Buono'
  if (score >= 40) return 'Sufficiente'
  if (score > 0) return 'Da migliorare'
  return ''
}

export function ScoreRing({ score, size = 140 }: ScoreRingProps) {
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const motionScore = useMotionValue(0)
  const springScore = useSpring(motionScore, {
    stiffness: 60,
    damping: 20,
    mass: 1,
  })
  const displayScore = useTransform(springScore, (v) => Math.round(v))
  const dashOffset = useTransform(
    springScore,
    (v) => circumference - (v / 100) * circumference
  )

  const scoreRef = useRef<HTMLSpanElement>(null)

  const color =
    score >= 70 ? 'text-green-500' : score >= 40 ? 'text-yellow-500' : 'text-red-500'
  const strokeColor =
    score >= 70 ? '#22c55e' : score >= 40 ? '#eab308' : '#ef4444'
  const glowColor =
    score >= 70 ? 'rgba(34,197,94,0.15)' : score >= 40 ? 'rgba(234,179,8,0.15)' : 'rgba(239,68,68,0.15)'

  useEffect(() => {
    motionScore.set(score)
  }, [score, motionScore])

  useEffect(() => {
    const unsubscribe = displayScore.on('change', (v) => {
      if (scoreRef.current) {
        scoreRef.current.textContent = String(v)
      }
    })
    return unsubscribe
  }, [displayScore])

  const label = getScoreLabel(score)

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
    >
      {/* Subtle glow behind */}
      <div
        className="absolute inset-2 rounded-full"
        style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)` }}
      />
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted/20"
        />
        {/* Filled arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: dashOffset }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span ref={scoreRef} className={`text-4xl font-bold ${color}`}>
          0
        </span>
        {label && (
          <span className="text-[11px] font-medium text-muted-foreground mt-0.5">
            {label}
          </span>
        )}
      </div>
    </div>
  )
}
