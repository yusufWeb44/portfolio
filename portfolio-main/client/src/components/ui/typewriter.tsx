"use client"

import { useEffect, useState } from "react"

export interface TypewriterProps {
  words: string[]
  speed?: number
  delayBetweenWords?: number
  cursor?: boolean
  cursorChar?: string
  className?: string
}

export function Typewriter({
  words,
  speed = 90,
  delayBetweenWords = 2000,
  cursor = true,
  cursorChar = "|",
  className = "",
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  useEffect(() => {
    if (!words || words.length === 0) return

    const current = words[wordIndex % words.length] || ""
    let timer: ReturnType<typeof setTimeout>

    if (!isDeleting) {
      if (charIndex < current.length) {
        timer = setTimeout(() => {
          setDisplayText(current.substring(0, charIndex + 1))
          setCharIndex((prev) => prev + 1)
        }, speed)
      } else {
        // Pause at the end of the word before starting to delete
        timer = setTimeout(() => {
          setIsDeleting(true)
        }, delayBetweenWords)
      }
    } else {
      if (charIndex > 0) {
        timer = setTimeout(() => {
          setDisplayText(current.substring(0, charIndex - 1))
          setCharIndex((prev) => prev - 1)
        }, Math.max(speed / 2.2, 35))
      } else {
        // Switch to the next word cleanly and start typing
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % words.length)
      }
    }

    return () => clearTimeout(timer)
  }, [charIndex, isDeleting, wordIndex, words, speed, delayBetweenWords])

  useEffect(() => {
    if (!cursor) return

    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 450)

    return () => clearTimeout(cursorInterval)
  }, [cursor])

  return (
    <span className={`inline-block ${className}`}>
      <span>{displayText}</span>
      {cursor && (
        <span
          className="ml-1 text-emerald-500 font-normal transition-opacity duration-75 select-none"
          style={{ opacity: showCursor ? 1 : 0 }}
        >
          {cursorChar}
        </span>
      )}
    </span>
  )
}
