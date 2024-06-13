'use client'

import { ProductDTO } from '@/lib/client/utils'
import Image from 'next/image'
import { priceToArs } from '@/utils/money'

export function Product({ description, image, price, title, url }: ProductDTO) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      <div className="flex flex-col w-64 shadow-md p-3 rounded-xl">
        <Image
          src={image}
          alt={title}
          className="w-full h-28 rounded-xl object-contain"
          width={244}
          height={112}
        />
        <h3 className="text-xl text-gray-700">{title}</h3>
        <p className="text-gray-500 text-sm line-clamp-4">{description}</p>
        <p className="text-gray-700 font-semibold">{priceToArs(price)}</p>
      </div>
    </a>
  )
}
