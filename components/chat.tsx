'use client'

import { ToolInvocation } from 'ai'
import { Message, useChat } from '@ai-sdk/react'
import { ProductSkeleton } from './product-skeleton'
import { Product } from './product'
import { ProductDTO } from '@/lib/client/utils'
import { Form } from './form'
import { ReactNode, useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useDebounce } from '@uidotdev/usehooks'

function replaceIdsWithLinks(content: string) {
  const regex = /\[(\w+)\]\(([^)]+)\)/g
  return content.replace(regex, '<a href="$1">$2</a>')
}

// TODO
function AssistantChat({ content }: { content: string }) {
  const [contentRendered, setContentRendered] = useState<ReactNode | null>(null)
  const debouncedContent = useDebounce(content, 500)

  useEffect(() => {
    const modifiedContent = replaceIdsWithLinks(debouncedContent)
    setContentRendered(modifiedContent)
  }, [debouncedContent])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
      className="mb-2 text-neutral-500"
      dangerouslySetInnerHTML={{ __html: content ?? '' }}
    ></motion.span>
  )
}

export default function Chat() {
  const messagesChat = useRef<HTMLDivElement | null>(null)

  const scrollMessagesToBottom = useCallback(() => {
    if (!messagesChat.current) return

    messagesChat.current.scrollTop = messagesChat.current.scrollHeight
  }, [])

  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 1,
    onFinish: () => {
      scrollMessagesToBottom()
    },
  })

  return (
    <div
      ref={messagesChat}
      className="h-screen overflow-auto min-w-[70%] w-[1000px] max-w-[840px] relative p-24"
    >
      {messages?.map((m: Message) => (
        <div key={m.id}>
          {m.role === 'user' ? (
            <div className="text-2xl text-gray-600 font-semibold">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {m.content}
              </motion.span>
            </div>
          ) : (
            <AssistantChat content={m.content} />
          )}

          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId

            return 'result' in toolInvocation ? (
              <div
                key={toolCallId}
                className="flex flex-row w-full justify-between gap-5"
              >
                {toolInvocation.toolName === 'findProducts' &&
                  (
                    toolInvocation.result as {
                      products: ProductDTO[]
                    }
                  ).products.map((product) => (
                    <Product key={product._id} {...product} className="w-1/3" />
                  ))}
              </div>
            ) : (
              <div
                key={toolCallId}
                className="flex flex-row w-full justify-between gap-5"
              >
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <ProductSkeleton key={i} className="w-1/3" />
                  ))}
              </div>
            )
          })}
          <br />
          <br />
          {m.role === 'assistant' && !m.toolInvocations && (
            <hr className="my-4" />
          )}
        </div>
      ))}

      <Form
        onChange={handleInputChange}
        value={input}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
