import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText } from 'ai'
import { z } from 'zod'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    system:
      'you are a useful assistant that helps users to find the best products for their needs',
    tools: {
      findProducts: {
        description: 'Find a list of products based on a query',
        parameters: z.object({
          query: z.string().describe('The query to search for products'),
        }),
        execute: async ({ query }) => {
          return {
            products: [
              {
                id: '1',
                name: 'Creatina',
                description: 'Creces',
              },
              {
                id: '2',
                name: 'Proteina',
                description: 'ayuda a tus musculos',
              },
            ],
          }
        },
      },
    },
  })

  return result.toAIStreamResponse()
}

const promiseArray: Promise<any>[] = []
