'use client'

import React, { useCallback, useRef, useState } from 'react'
import { useWindowSize } from '@uidotdev/usehooks'
import { FlipWords } from './flipping-words'
import { motion } from 'framer-motion'

type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Form({ onChange, onSubmit, value }: Props) {
  const { height } = useWindowSize()

  const [focused, setFocused] = useState(false)
  const [conversationStarted, setConversationStarted] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!value) return

      if (!conversationStarted) {
        setConversationStarted(true)
      }
      onSubmit(e)
      inputRef.current?.focus()
    },
    [value, conversationStarted, onSubmit]
  )

  const searchs = [
    'Gift for my son’s 10th birthday',
    'Present for my daughter who loves art',
    'Furniture for my new office',
    'Sport supplements',
  ]

  return (
    <motion.form
      onSubmit={submit}
      initial={{
        top: '50%',
      }}
      animate={{
        top: conversationStarted && height ? `${height - 42}px` : '50%',
      }}
      transition={{
        duration: 1.2,
        ease: 'easeInOut',
      }}
      className="fixed left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full w-[1000px] transition-all duration-1000 ease-in-out flex justify-center items-center"
    >
      <motion.div
        initial={{
          width: '60%',
        }}
        animate={{
          width: conversationStarted ? '70%' : '60%',
        }}
        transition={{
          duration: 1,
          ease: 'easeInOut',
        }}
        className="relative min-w-72"
      >
        {value || conversationStarted ? null : (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none placeholder-opacity-0	">
            <FlipWords words={searchs} />
          </div>
        )}

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.8,
          }}
          animate={{
            opacity: focused ? 1 : 0,
            scale: focused ? 1 : 0.4,
          }}
          transition={{
            duration: 0.4,
            ease: 'easeInOut',
          }}
          className="absolute top-2 blur-md bg-primary w-full h-10 animate-pulse pointer-events-none -z-10 transition-all duration-500 ease-out rounded-full"
        />

        <input
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          ref={inputRef}
          onChange={onChange}
          placeholder={conversationStarted ? 'Search for something...' : ''}
          value={value}
          className="w-full p-3 outline-black border-black border-solid border-2 rounded-full"
        />
      </motion.div>
    </motion.form>
  )
}
