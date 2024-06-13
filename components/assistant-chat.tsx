import { motion } from 'framer-motion'
import { useState, ReactNode, useCallback, useEffect } from 'react'

export function AssistantText({ content }: { content: string }) {
  const [contentRendered, setContentRendered] = useState<ReactNode[]>([])

  const converToRenderText = useCallback((text: string) => {
    const textSplitted = text.split('^^')
    const elementsToRender = []
    for (let i = 0; i < textSplitted.length; i++) {
      const splitPart = textSplitted[i]

      if (splitPart.startsWith('_')) {
        if (i === textSplitted.length - 1) {
          continue
        }

        const [id, title] = splitPart.replace('_', '').split(':')
        elementsToRender.push(
          <b>
            {id}: {title}
          </b>
        )
      } else {
        elementsToRender.push(splitPart)
      }
    }

    setContentRendered(elementsToRender)
  }, [])

  useEffect(() => {
    converToRenderText(content)
  }, [content, converToRenderText])

  return (
    <motion.span
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.75 }}
      className="mb-2 text-neutral-500"
    >
      {contentRendered}
    </motion.span>
  )
}
