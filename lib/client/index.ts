import { Product } from '@/types/products'
import { createClientCollection } from './collection'
import { ProductDTO, mapProductToDTO } from './utils'

const PRODUCTS_LIMIT = 3
const MAX_CANDIDATES = 100

export async function findProductsFromEmbedding(
  embedding: number[]
): Promise<ProductDTO[]> {
  const collection = await createClientCollection()

  // Query for similar documents.
  const documents = await collection
    .aggregate([
      {
        $vectorSearch: {
          queryVector: embedding,
          path: 'embedding',
          numCandidates: MAX_CANDIDATES,
          limit: PRODUCTS_LIMIT, // Limit the number of documents to return. Adjust as needed.,
          index: 'productsEmbeddingsIdx',
        },
      },
    ])
    .toArray()

  // TODO: review why is not being inferred as Product[]
  return mapProductToDTO(documents as Product[])
}
