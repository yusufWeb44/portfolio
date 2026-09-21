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
  speed = 80,
  delayBetweenWords = 2200,
  cursor = true,
  cursorChar,
  className = "",
}: TypewriterProps) {
  const firstWord = (words && words.length > 0) ? words[0] : ""
  const [displayText, setDisplayText] = useState(firstWord)
  const [isDeleting, setIsDeleting] = useState(false)
  const [wordIndex, setWordIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(firstWord.length)

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

  const useCustomChar = cursorChar && cursorChar !== "_" && cursorChar !== "|"

  // Bind the last word and the cursor together in whitespace-nowrap so cursor never drops to a new line
  const lastSpaceIndex = displayText.lastIndexOf(" ")
  const hasSpace = lastSpaceIndex !== -1
  const leadingText = hasSpace ? displayText.substring(0, lastSpaceIndex + 1) : ""
  const lastWord = hasSpace ? displayText.substring(lastSpaceIndex + 1) : displayText

  return (
    <span className={`inline-block ${className}`} dir="auto">
      {leadingText && <span>{leadingText}</span>}
      <span className="inline whitespace-nowrap">
        <span>{lastWord || (!leadingText ? '\u200B' : '')}</span>
        {cursor && (
          useCustomChar ? (
            <span
              aria-hidden="true"
              className="ms-1 text-emerald-500 font-normal select-none inline-block align-baseline"
              style={{ animation: 'cursorBlink 1s step-end infinite' }}
            >
              {cursorChar}
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="inline-block w-[3.5px] h-[0.85em] bg-emerald-500 rounded-full mx-1.5 align-baseline select-none shrink-0"
              style={{
                animation: 'cursorBlink 1s step-end infinite',
                transform: 'translateY(1px)',
              }}
            />
          )
        )}
      </span>
    </span>
  )
}
