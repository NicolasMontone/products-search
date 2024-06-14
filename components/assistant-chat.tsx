import { motion } from 'framer-motion'
import { useState, ReactNode, useCallback, useEffect, useMemo } from 'react'
import { ProductDTO } from '../lib/client/utils'
import { LinkPreview } from './link-preview'

type Props = {
  content: string
  products: Record<string, ProductDTO>
}

export function AssistantText({ content, products }: Props) {
  const [contentRendered, setContentRendered] = useState<ReactNode[]>([])

  const convertToRenderText = useCallback(
    (text: string) => {
      const textSplitted = text.split('^^')
      const elementsToRender = []
      for (let i = 0; i < textSplitted.length; i++) {
        const splitPart = textSplitted[i]

        if (splitPart.startsWith('_')) {
          if (i === textSplitted.length - 1) {
            continue
          }

          const [id, title] = splitPart.replace('_', '').split(':')
          const product = products[id]

          elementsToRender.push(
            product ? (
              <LinkPreview
                id={id}
                key={`${product._id}_${i}`}
                src={product.image}
                url={product.url}
                height={100}
                className="text-blue-800 font-semibold"
              >
                {title}
              </LinkPreview>
            ) : (
              title
            )
          )
        } else {
          elementsToRender.push(splitPart)
        }
      }

      setContentRendered(elementsToRender)
    },
    [products]
  )

  useEffect(() => {
    convertToRenderText(content)
  }, [content, convertToRenderText])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
      className="mb-2 text-neutral-500"
    >
      {contentRendered.map((contentToRender, i) => (
        <span key={i}>{contentToRender}</span>
      ))}
    </motion.span>
  )
}
