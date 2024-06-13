'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useWindowSize } from '@uidotdev/usehooks'
import { FlipWords } from './flipping-words'

type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function useAnimation(
  formRef: React.RefObject<HTMLFormElement | null>,
  inputContainerRef: React.RefObject<HTMLDivElement | null>,
  conversationStarted: boolean
) {
  const { height } = useWindowSize()
  useEffect(() => {
    if (
      !formRef.current ||
      !inputContainerRef.current ||
      !height ||
      !conversationStarted
    )
      return

    formRef.current.style.transition = 'all 1s ease-in-out'
    inputContainerRef.current.style.transition = 'all 1s ease-in-out'

    formRef.current.style.top = `${height - 42}px`
    inputContainerRef.current.style.width = '70%'
  }, [conversationStarted, formRef, height, inputContainerRef])
}

export function Form({ onChange, onSubmit, value }: Props) {
  const [conversationStarted, setConversationStarted] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const inputContainerRef = useRef<HTMLDivElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!conversationStarted) {
        setConversationStarted(true)
      }
      onSubmit(e)
      inputRef.current?.focus()
    },
    [onSubmit, conversationStarted]
  )

  useAnimation(formRef, inputContainerRef, conversationStarted)

  const searchs = [
    'Gift for my son’s 10th birthday',
    'Present for my daughter who loves art',
    'Furniture for my new office',
    'Sport supplements',
  ]

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full w-[1000px] transition-all duration-1000 ease-in-out flex justify-center items-center"
    >
      <div className="w-[60%] relative" ref={inputContainerRef}>
        {value || conversationStarted ? null : (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none placeholder-opacity-0	">
            <FlipWords words={searchs} />
          </div>
        )}
        <input
          ref={inputRef}
          onChange={onChange}
          placeholder=""
          value={value}
          className="w-full p-3 outline-black border-black border-solid border-2 rounded-full"
        />
      </div>
    </form>
  )
}
/**
 * 'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

type Props = {
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function useAnimation(
  formRef: React.RefObject<HTMLFormElement | null>,
  inputRef: React.RefObject<HTMLInputElement | null>,
  conversationStarted: boolean
) {
  useEffect(() => {
    if (!formRef.current || !inputRef.current || !conversationStarted) return

    formRef.current.style.transition = 'all 1s ease-in-out'
    inputRef.current.style.transition = 'all 1s ease-in-out'

    formRef.current.style.top = 'auto'
    formRef.current.style.bottom = '1rem'
    inputRef.current.style.width = '1000px'
  }, [conversationStarted, formRef, inputRef])
}

export function Form({ onChange, onSubmit, value }: Props) {
  const [conversationStarted, setConversationStarted] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const formRef = useRef<HTMLFormElement | null>(null)

  const submit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!conversationStarted) {
        setConversationStarted(true)
      }
      onSubmit(e)
      inputRef.current?.focus()
    },
    [onSubmit, conversationStarted]
  )

  useAnimation(formRef, inputRef, conversationStarted)

  return (
    <form
      ref={formRef}
      onSubmit={submit}
      className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-full w-[1000px] transition-all duration-1000 ease-in-out flex justify-center items-center"
    >
      <input
        ref={inputRef}
        onChange={onChange}
        placeholder="Say something..."
        value={value}
        className="p-3 outline-black border-black border-solid border-2 rounded-full w-[50%]"
      />
    </form>
  )
}

 */
