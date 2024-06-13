'use client'

export function ProductSkeleton() {
  return (
    <div className="w-64 shadow-lg p-3 animate-pulse rounded-xl">
      <div className="w-full h-28 rounded-xl animate-pulse bg-gray-300" />
      <div className="w-1/2 h-4 mt-2 rounded-xl animate-pulse bg-gray-300" />
      <div className="w-1/3 h-4 mt-2 rounded-xl animate-pulse bg-gray-300" />
      <div className="w-1/4 h-4 mt-2 rounded-xl animate-pulse bg-gray-300" />
    </div>
  )
}
