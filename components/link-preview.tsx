'use client'
import * as HoverCardPrimitive from '@radix-ui/react-hover-card'
import Image from 'next/image'
import React from 'react'
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useSpring,
} from 'framer-motion'
import Link from 'next/link'
import { cn } from '@/utils/cn'

type LinkPreviewProps = {
  id: string
  children: React.ReactNode
  url: string
  src: string
  className?: string
  width?: number
  height?: number
  quality?: number
  layout?: string
}

export const LinkPreview = ({
  id,
  children,
  url,
  src,
  className,
  width = 200,
  height = 125,
  quality = 50,
  layout = 'fixed',
}: LinkPreviewProps) => {
  const [isOpen, setOpen] = React.useState(false)

  const springConfig = { stiffness: 100, damping: 15 }
  const x = useMotionValue(0)

  const translateX = useSpring(x, springConfig)

  const handleMouseMove = (event: any) => {
    const targetRect = event.target.getBoundingClientRect()
    const eventOffsetX = event.clientX - targetRect.left
    const offsetFromCenter = (eventOffsetX - targetRect.width / 2) / 2 // Reduce the effect to make it subtle
    x.set(offsetFromCenter)
  }

  return (
    <HoverCardPrimitive.Root
      key={id}
      openDelay={50}
      closeDelay={100}
      onOpenChange={(open) => {
        setOpen(open)
      }}
    >
      <HoverCardPrimitive.Trigger
        onMouseMove={handleMouseMove}
        className={cn('text-black dark:text-white', className)}
        href={url}
      >
        {children}
      </HoverCardPrimitive.Trigger>

      <HoverCardPrimitive.Content
        className="[transform-origin:var(--radix-hover-card-content-transform-origin)]"
        side="top"
        align="center"
        sideOffset={10}
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.6 }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                transition: {
                  type: 'spring',
                  stiffness: 260,
                  damping: 20,
                },
              }}
              exit={{ opacity: 0, y: 20, scale: 0.6 }}
              className="shadow-xl rounded-xl"
              style={{
                x: translateX,
              }}
            >
              <Link
                href={url}
                className="block p-1 bg-white border-2 border-transparent shadow rounded-xl hover:border-neutral-200 dark:hover:border-neutral-800"
                style={{ fontSize: 0 }}
              >
                <Image
                  src={src}
                  width={width}
                  height={height}
                  quality={quality}
                  layout={layout}
                  priority={true}
                  style={{
                    maxHeight: height,
                  }}
                  className="rounded-lg object-contain"
                  alt="preview image"
                />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </HoverCardPrimitive.Content>
    </HoverCardPrimitive.Root>
  )
}
