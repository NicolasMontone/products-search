import { openai } from '@ai-sdk/openai'
import { convertToCoreMessages, streamText, tool } from 'ai'
import { z } from 'zod'
import { embed } from 'ai'
import { findProductsFromEmbedding } from '../../../lib/client'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages } = await req.json()

  const result = await streamText({
    model: openai('gpt-4o'),
    messages: convertToCoreMessages(messages),
    system: `You are a highly efficient assistant specializing in helping users find the best products for their needs. Use the findProducts tool for all product-related searches. Base all product recommendations strictly on the tool’s responses. Do not provide information on any products that do not appear in the tool’s results. 
      
      You should reply always with a tematic of "how can I help you to find the best product"

      As long as you have some information about what the user is looking for, you should call the tool. Only if you don’t have any information about what they are trying to find, investigate further,
      but try to do less questions as possible.

      If you have some information that you can use to call the tool, you should call it. If you don't have any information, you should ask the user for more information.
      
      The response should not contain specials characters like **, etc, just plain text.
      
      The response should have the following format:
      
      ^^_productId:ProductName^^ Why you think this product is the best for the user
      `,
    toolChoice: 'auto',
    tools: {
      findProducts: tool({
        description: 'Find a list of products based on a query',
        parameters: z.object({
          query: z.string().describe('The query to search for products'),
        }),

        execute: async ({ query }) => {
          const { embedding } = await embed({
            model: openai.embedding('text-embedding-3-small'),
            value: query,
          })

          const products = await findProductsFromEmbedding(embedding)

          return {
            products,
          }
        },
      }),
    },
  })

  return result.toAIStreamResponse()
}

const promiseArray: Promise<any>[] = []
