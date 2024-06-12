'use client'

import { ToolInvocation } from 'ai'
import { Message, useChat } from '@ai-sdk/react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, addToolResult } =
    useChat({
      maxToolRoundtrips: 5,

      // run client-side tools that are automatically executed:
      async onToolCall({ toolCall }) {
        if (toolCall.toolName === 'getLocation') {
          const cities = ['New York', 'Los Angeles', 'Chicago', 'San Francisco']
          return cities[Math.floor(Math.random() * cities.length)]
        }
      },
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
              <div key={toolCallId}>
                Tool call {`${toolInvocation.toolName}: `}
                {JSON.stringify(toolInvocation.result)}
              </div>
            ) : (
              <div key={toolCallId}>Calling {toolInvocation.toolName}...</div>
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
