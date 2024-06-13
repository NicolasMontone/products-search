'use client'

import { ToolInvocation } from 'ai'
import { Message, useChat } from '@ai-sdk/react'
import { ProductSkeleton } from './product-skeleton'
import { Product } from './product'
import { ProductDTO } from '@/lib/client/utils'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    maxToolRoundtrips: 1,
  })

  return (
    <div>
      {messages?.map((m: Message) => (
        <div key={m.id}>
          <strong>{`${m.role}: `}</strong>
          {m.content}

          {m.toolInvocations?.map((toolInvocation: ToolInvocation) => {
            const toolCallId = toolInvocation.toolCallId

            return 'result' in toolInvocation ? (
              <div key={toolCallId} className='flex flex-row gap-3'>
                {toolInvocation.toolName === 'findProducts' &&
                  (
                    toolInvocation.result as {
                      products: ProductDTO[]
                    }
                  ).products.map((product) => (
                    <Product key={product._id} {...product} />
                  ))}
              </div>
            ) : (
              <div key={toolCallId} className="flex flex-row gap-3">
                {Array(3)
                  .fill(0)
                  .map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
              </div>
            )
          })}
          <br />
          <br />
        </div>
      ))}

      <form onSubmit={handleSubmit}>
        <input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  )
}
