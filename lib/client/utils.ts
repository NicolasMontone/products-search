import { Product } from '@/types/products'

export type ProductDTO = Omit<Product, '_id' | 'embedding'> & { _id: string }

export function mapProductToDTO(products: Product[]): ProductDTO[] {
  return products.map((product) => ({
    _id: product._id.toString(),
    description: product.description,
    image: product.image,
    price: product.price,
    title: product.title,
    url: product.url,
  }))
}
