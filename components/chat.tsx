'use client'

import { ToolInvocation } from 'ai'
import { Message, useChat } from '@ai-sdk/react'
import { ProductSkeleton } from './product-skeleton'
import { Product } from './product'
import { ProductDTO } from '@/lib/client/utils'
import { Form } from './form'
import { useCallback, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { AssistantText } from './assistant-chat'

export default function Chat() {
  const messagesChat = useRef<HTMLDivElement | null>(null)
  const [productsList, setProductsList] = useState<Record<string, ProductDTO>>(
    {}
  )

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

  useEffect(() => {
    const productsToSet: Record<string, ProductDTO> = {}

    for (const message of messages) {
      if (message.toolInvocations) {
        for (const toolInvocation of message.toolInvocations) {
          if ('result' in toolInvocation) {
            for (const product of (
              toolInvocation.result as { products: ProductDTO[] }
            ).products) {
              productsToSet[product._id] = product
            }
          }
        }
      }
    }

    setProductsList((prev) => ({ ...prev, ...productsToSet }))
  }, [messages])

  return (
    <div
      ref={messagesChat}
      className="h-screen overflow-auto sm:min-w-[70%] sm:w-[1000px] sm:max-w-[840px] relative sm:p-24 p-12 min-w-[90%]"
    >
      {messages?.map((m: Message) => (
        <div key={m.id}>
          {m.role === 'user' ? (
            <div className="text-3xl text-gray-600 font-semibold">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {m.content}
              </motion.span>
            </div>
          ) : (
            <AssistantText content={m.content} products={productsList} />
          )}

          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId

            return 'result' in toolInvocation ? (
              <div
                key={toolCallId}
                className="flex sm:flex-row flex-col w-full justify-between items-center gap-5 flex-wrap sm:flex-nowrap"
              >
                {toolInvocation.toolName === 'findProducts' &&
                  (
                    toolInvocation.result as {
                      products: ProductDTO[]
                    }
                  ).products.map((product) => (
                    <Product
                      key={`${product._id}_${toolCallId}`}
                      {...product}
                      className="sm:w-1/3"
                    />
                  ))}
              </div>
            ) : (
              <div
                key={toolCallId}
                className="flex sm:flex-row flex-col w-full justify-between items-center gap-5 flex-wrap sm:flex-nowrap"
              >
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <ProductSkeleton key={i} className="sm:w-1/3" />
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
