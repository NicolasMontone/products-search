'use client'

import { ProductDTO } from '@/lib/client/utils'
import Image from 'next/image'
import { priceToArs } from '@/utils/money'
import { cn } from '@/utils/cn'

type Props = ProductDTO & {
  className?: string
}

export function Product({
  description,
  image,
  price,
  title,
  url,
  className,
}: Props) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={cn('flex flex-col w-full shadow-md p-3 rounded-xl bg-white', className)}
    >
      <Image
        src={image}
        alt={title}
        className="w-full h-28 rounded-xl object-contain mb-6"
        width={244}
        height={112}
      />
      <p className="text-gray-700 font-semibold mb-2">{priceToArs(price)}</p>
      <h3 className="text-xl text-gray-700 line-clamp-3 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm line-clamp-4 mb-2">{description}</p>
    </a>
  )
}
